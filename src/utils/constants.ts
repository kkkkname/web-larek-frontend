import { ProductCategory } from '../types';

export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings: { [key in ProductCategory]: string } = {
	'софт-скил': 'soft',
	'хард-скил': 'hard',
	'другое': 'other',
	'дополнительное': 'additional',
	'кнопка': 'button',
};

/* form.ts **/
export const FORM_SELECTORS = {
	submitButton: 'button[type=submit]',
	errorContainer: '.form__errors',
};

export const FORM_EVENTS = {
	input: 'input',
	submit: 'submit',
};

export const FORM_EVENT_PREFIX = ':submit';
/* form.ts **/

/* modal.ts **/
export const MODAL_SELECTORS = {
	closeButton: '.modal__close',
	modalContent: '.modal__content',
};

export const MODAL_EVENTS = {
	open: 'modal:open',
	close: 'modal:close',
};

export const MODAL_ACTIVE_CLASS = 'modal_active';
/* modal.ts **/

/* card.ts **/
export const CARD_SELECTORS = {
	title: '.card__title',
	price: '.card__price',
	image: '.card__image',
	category: '.card__category',
	button: '.card__button',
	description: '.card__text',
	index: '.basket__item-index',
};

export const CARD_BUTTON_TEXT = {
	inBasket: 'Убрать',
	addToBasket: 'В корзину',
};

export const UNKNOWN_CATEGORY = 'unknown';
/* card.ts **/

/* orderView.ts **/
export const ORDER_SELECTORS = {
	cardButton: 'card',
	cashButton: 'cash',
	submitButton: 'submit',
	addressInput: 'address',
};

export const ORDER_CLASSES = {
	buttonActive: 'button-active',
};

export const ORDER_SUCCESS_SELECTORS = {
	description: '.order-success__description',
	button: '.order-success__close',
};
/* orderView.ts **/

export const ORDER_SUCCESS_EVENTS = {
	submit: 'orderSuccess:submit',
};

/* pageView.ts **/
export const PAGE_SELECTORS = {
	counter: '.header__basket-counter',
	catalog: '.gallery',
	wrapper: '.page__wrapper',
	basket: '.header__basket',
};

export const PAGE_EVENTS = {
	basketOpen: 'basket:open',
};
/* pageView.ts **/


