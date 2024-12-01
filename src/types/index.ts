/** Тип категорий продукта */
export type ProductCategory =
	| 'софт-скил'
	| 'другое'
	| 'дополнительное'
	| 'хард-скил'
	| 'кнопка';

/** Ошибки для платежной информации заказа */
export type OrderPaymentError = Partial<Record<keyof IOrderPayment, string>>;

/** Ошибки для контактной информации заказа */
export type OrderContactError = Partial<Record<keyof IOrderContacts, string>>;

export interface ApiResponse<T> {
	total: number;
	items: T[];
}

export type FormName = 'order' | 'contacts';

/** Интерфейс для описания продукта */
export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: ProductCategory;
	price: number | null;
}

/** Интерфейс расширяющий IProduct для добавления индекса у карточки */
export interface ICard extends IProduct {
	index?: number;
}

/** Интерфейс взаимодействия с карточкой */
export interface ICardAction {
	onClick: (event: MouseEvent) => void;
}

/** Интерфейс для информации о платеже заказа */
export interface IOrderPayment {
	payment: string;
	address: string;
}

/** Интерфейс для контактной информации заказа */
export interface IOrderContacts {
	email: string;
	phone: string;
}

export interface IForm extends IOrderPayment, IOrderContacts {}

/** Интерфейс для заказа */
export interface IOrder extends IOrderContacts, IOrderPayment {
	total: number;
	items: string[];
}

/** Интерфейс для результата заказа */
export interface IOrderResult {
	id: string;
	total: number;
}

/** Интерфейс для страницы приложения */
export interface IPage {
	counter: number;
	catalog: HTMLElement;
	basket: HTMLElement;
}

/** Интерфейс для состояния приложения */
export interface IState {
	catalog: IProduct[];
	basket: IProduct[];
	order: IOrder;
	orderPaymentError: OrderPaymentError;
	orderContactError: OrderContactError;
}

/** Интерфейс для результатов валидации формы */
export interface IFormValidation {
	valid: boolean;
	errors: string[];
}


/** Интерфейс для контента модального окна */
export interface IModal {
	content: HTMLElement
}

/** Интерфейс для получения продуктов через API */
export interface IApi {
	getItemList: () => Promise<IProduct[]>;
}
