import {
	IForm,
	IOrder,
	FormName,
	IProduct,
	IState,
	OrderContactError,
	OrderPaymentError,
} from '../types';
import { IEvents } from './base/events';
import { Model } from './base/model';

export class AppState extends Model<IState> {
	catalog: IProduct[] = [];
	basket: IProduct[] = []
	order: IOrder = this.createEmptyOrder();
	orderPaymentError: OrderPaymentError = {};
	orderContactError: OrderContactError = {};

	private savedOrderState: Partial<IOrder> = {};
	private savedOrderPaymentErrors: OrderPaymentError = {};
	private savedOrderContactsErrors: OrderContactError = {};

	constructor(data: Partial<IState>, protected events: IEvents) {
		super(data, events);
		this.catalog = []
		this.basket = []
		this.cleanOrder();
	}

	private createEmptyOrder(): IOrder {
		return {
			address: '',
			payment: '',
			email: '',
			phone: '',
			total: 0,
			items: [],
		};
	}

	setCatalog(items: IProduct[]) {
		this.catalog = items;
		this.emitChanges('items:changed');
	}

	addBasket(item: IProduct) {
		this.basket.push(item);
		this.emitChanges('basket:changed');
	}

	removeBasket(item: IProduct) {
		this.basket = this.basket.filter(basketItem => basketItem.id !== item.id);
		this.emitChanges('basket:changed');
	}

	isInBasket(item: IProduct): boolean {
		return this.basket.some(basketItem => basketItem.id === item.id);
	}

	getNumberBasket(): number {
		return this.basket.length;
	}

	getTotalBasket(): number {
		return this.basket.reduce((total, item) => total + item.price, 0);
	}

	setField(field: keyof IForm, value: string): void {
		this.order[field] = value;

		if (this.validate('order')) {
			this.events.emit('order:ready', this.order);
		}

		if (this.validate('contacts')) {
			this.events.emit('contacts:ready', this.order);
		}
	}

	validate(formType: FormName): boolean {
		const errors = formType === 'order' ? this.setOrderErrors() : this.setContactsErrors();
		this.events.emit(`${formType}FormErrors:change`, errors);
		return Object.keys(errors).length === 0;
	}

	private setOrderErrors(): OrderPaymentError {
		const errors: OrderPaymentError = {};
		if (!this.order.payment) {
			errors.payment = 'Выберите способ оплаты';
		}

		if (!this.order.address) {
			errors.address = 'Укажите адрес';
		}

		this.orderPaymentError = errors;
		return errors;
	}

	private setContactsErrors(): OrderContactError {
		const errors: OrderContactError = {};
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const phoneRegex =
			/^\+?[1-9]\d{0,2}?[-\s.]?\(?\d{1,4}?\)?[-\s.]?\d{1,4}[-\s.]?\d{1,4}[-\s.]?\d{1,9}$/;

		if (!this.order.phone) {
			errors.phone = 'Укажите номер телефона';
		} else if (!phoneRegex.test(this.order.phone)) {
			errors.phone = 'Вы ввели некорректный номер телефона';
		}

		if (!this.order.email) {
			errors.email = 'Укажите адрес электронной почты';
		} else if (!emailRegex.test(this.order.email)) {
			errors.email = 'Вы ввели некорректный адрес электронной почты';
		}

		this.orderContactError = errors;
		return errors;
	}

	cleanOrder() {
		this.order = this.createEmptyOrder();
		this.orderPaymentError = {};
		this.orderContactError = {};
	}

	cleanBasketState() {
		this.basket = [];
		this.emitChanges('basket:changed');
	}

	prepareOrder() {
		this.order.total = this.getTotalBasket();
		this.order.items = this.basket.filter(item => item.price).map(item => item.id);
	}

	getOrderData(): IOrder {
		return structuredClone(this.order);
	}

	getAddress(): string {
		return this.order.address;
	}

	getPayment(): string {
		return this.order.payment;
	}

	getEmail(): string {
		return this.order.email;
	}

	getPhone(): string {
		return this.order.phone;
	}

	saveOrderState() {
		this.savedOrderState = { ...this.order };
		this.savedOrderPaymentErrors = { ...this.orderPaymentError };
		this.savedOrderContactsErrors = { ...this.orderContactError };
	}

	restoreOrderState() {
		this.order = { ...this.savedOrderState } as IOrder;
		this.orderPaymentError = { ...this.savedOrderPaymentErrors };
		this.orderContactError = { ...this.savedOrderContactsErrors };
		this.emitChanges('order:restore');
		this.emitChanges('contacts:restore');
	}
}