import { Component } from '../base/component';
import { IOrderResult } from '../../types';
import { EventEmitter } from '../base/events';
import { currency, ensureElement } from '../../utils/utils';
import { ORDER_SUCCESS_SELECTORS, ORDER_SUCCESS_EVENTS } from '../../utils/constants';

export class OrderSuccess extends Component<IOrderResult> {
	private _button: HTMLButtonElement;
	private _description: HTMLElement;

	constructor(container: HTMLElement, private events: EventEmitter) {
		super(container);

		this._description = ensureElement<HTMLElement>(ORDER_SUCCESS_SELECTORS.description, container);
		this._button = ensureElement<HTMLButtonElement>(ORDER_SUCCESS_SELECTORS.button, container);

		this._button.addEventListener('click', () => {
			this.events.emit(ORDER_SUCCESS_EVENTS.submit);
		});
	}

	/** Устанавливаем текст с общей суммой заказа */
	set total(value: number) {
		this._description.textContent = `Списано ${currency(value)}`;
	}
}
