import { Component } from '../base/component';
import { IOrder } from '../../types';
import { EventEmitter } from '../base/events';
import { createElement, currency } from '../../utils/utils';

export class Basket extends Component<IOrder> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._list = this.container.querySelector('.basket__list');
		this._total = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('order:open');
			});

			this.items = [];
			this.disableButton(true);
		}
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
		} else {
			this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
				textContent: 'Корзина пуста',
			}));
		}
	}

	set total(total: number) {
		this._total.textContent = currency(total);
	}

	disableButton(disabled: boolean) {
		this.setDisabled(this._button, disabled);
	}
}
