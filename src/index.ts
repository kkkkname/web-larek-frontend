import './scss/styles.scss';
import { WebAPI } from './components/API';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { AppState } from './components/appState';
import { Page } from './components/view/pageView';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal } from './components/common/modal';
import { Basket } from './components/elements/basket';
import { Order } from './components/elements/forms/orderForm';
import { Contacts } from './components/elements/forms/contactForm';
import { OrderSuccess } from './components/view/orderView';
import { FormName, IForm, IOrderContacts, IOrderPayment, IProduct } from './types';
import { Form } from './components/common/form';
import { Card } from './components/elements/card';

// Инициализация зависимостей
const api = new WebAPI(CDN_URL, API_URL);
const events = new EventEmitter();
const appState = new AppState({}, events);
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Функция для получения шаблонов
const getTemplateElement = <T extends HTMLElement>(selector: string): T => ensureElement<T>(selector);

const templates = {
	cardCatalog: getTemplateElement<HTMLTemplateElement>('#card-catalog'),
	cardPreview: getTemplateElement<HTMLTemplateElement>('#card-preview'),
	basket: getTemplateElement<HTMLTemplateElement>('#basket'),
	cardBasket: getTemplateElement<HTMLTemplateElement>('#card-basket'),
	order: getTemplateElement<HTMLTemplateElement>('#order'),
	contacts: getTemplateElement<HTMLTemplateElement>('#contacts'),
	success: getTemplateElement<HTMLTemplateElement>('#success'),
};

// Компоненты
const basket = new Basket(cloneTemplate(templates.basket), events);
const order = new Order(cloneTemplate(templates.order), events);
const contacts = new Contacts(cloneTemplate(templates.contacts), events);
const orderSuccess = new OrderSuccess(cloneTemplate(templates.success), events);

// Обработка ошибок формы
const onFormErrorChange = <T>(input: { errors: Partial<T>; form: Form<T> }) => {
	input.form.valid = Object.values(input.errors).every((text) => !text);
	input.form.errors = Object.values(input.errors).filter(Boolean).join('; ');
};

// Рендеринг формы
const renderForm = (formName: FormName) => {
	const form = formName === 'order' ? order : contacts;
	const errors = formName === 'order' ? appState.orderPaymentError : appState.orderContactError;
	const state = {
		...appState.order,
		valid: Object.keys(errors).length === 0,
		errors: Object.values(errors),
	};

	form.clearFields();
	modal.render({ content: form.render(state) });
};

// Обработчики событий
const handleCatalogChange = () => {
	page.catalog = appState.catalog.map((item) => {
		const card = new Card(cloneTemplate(templates.cardCatalog), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			price: item.price,
			image: item.image,
			category: item.category,
		});
	});
};

const handleCardSelect = (item: IProduct) => {
	const card = new Card(cloneTemplate(templates.cardPreview), {
		onClick: () => {
			if (!appState.isInBasket(item)) {
				appState.addBasket(item);
			} else {
				appState.removeBasket(item);
			}
			card.inBasket = appState.isInBasket(item);
		},
	});

	card.inBasket = appState.isInBasket(item);
	card.category = item.category;
	modal.render({
		content: card.render({
			title: item.title,
			image: item.image,
			description: item.description,
			price: item.price,
			category: item.category,
		}),
	});
};

const handleBasketChange = () => {
	page.counter = appState.getNumberBasket();
	basket.items = appState.basket.map((item, index) => {
		const card = new Card(cloneTemplate(templates.cardBasket), {
			onClick: () => appState.removeBasket(item),
		});
		return card.render({
			title: item.title,
			price: item.price,
			index: index + 1,
		});
	});

	const totalNumber = appState.getTotalBasket();
	basket.total = totalNumber;
	basket.disableButton(!totalNumber);
};

const handleModalOpen = () => {
	page.locked = true;
};

const handleModalClose = () => {
	appState.saveOrderState();
	page.locked = false;
};

const handleBasketOpen = () => {
	modal.render({ content: basket.render() });
};

const handleOrderOpen = () => {
	appState.restoreOrderState();
	renderForm('order');
};

const handleContactsOpen = () => {
	appState.restoreOrderState();
	renderForm('contacts');
};

const handleFormChange = (data: { field: keyof IForm; value: string }) => {
	appState.setField(data.field, data.value);
};

const handleOrderSubmit = () => {
	renderForm('contacts');
};

const handleContactsSubmit = async () => {
	try {
		appState.prepareOrder();
		await api.postOrder(appState.getOrderData());
		modal.render({
			content: orderSuccess.render({
				total: appState.getTotalBasket(),
			}),
		});
		appState.cleanBasketState();
	} catch (err) {
		console.error(err);
	} finally {
		appState.cleanOrder();
	}
};

const handleOrderSuccessSubmit = () => modal.close();

// Подписка на события
events.on('items:changed', handleCatalogChange);
events.on('card:select', handleCardSelect);
events.on('basket:changed', handleBasketChange);
events.on('modal:open', handleModalOpen);
events.on('modal:close', handleModalClose);
events.on('basket:open', handleBasketOpen);
events.on('order:open', handleOrderOpen);
events.on('contacts:open', handleContactsOpen);
events.on(/^(order|contacts)\..*:change/, handleFormChange);
events.on('orderFormErrors:change', (errors: Partial<IOrderPayment>) => onFormErrorChange({ errors, form: order }));
events.on('contactsFormErrors:change', (errors: Partial<IOrderContacts>) => onFormErrorChange({ errors, form: contacts }));
events.on('order:submit', handleOrderSubmit);
events.on('contacts:submit', handleContactsSubmit);
events.on('orderSuccess:submit', handleOrderSuccessSubmit);

// Получение данных каталога
api.getItemList()
	.then((result) => appState.setCatalog(result))
	.catch((err) => console.error(err));
