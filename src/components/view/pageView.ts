import { Component } from '../base/component';
import { IPage } from '../../types';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { PAGE_SELECTORS, PAGE_EVENTS } from '../../utils/constants';

export class Page extends Component<IPage> {
	private _counter: HTMLElement;
	private _catalog: HTMLElement;
	private _wrapper: HTMLElement;
	private _basket: HTMLElement;

	constructor(container: HTMLElement, private events: IEvents) {
		super(container);

		this._counter = ensureElement<HTMLElement>(PAGE_SELECTORS.counter);
		this._catalog = ensureElement<HTMLElement>(PAGE_SELECTORS.catalog);
		this._wrapper = ensureElement<HTMLElement>(PAGE_SELECTORS.wrapper);
		this._basket = ensureElement<HTMLElement>(PAGE_SELECTORS.basket);

		// Добавляем событие
		this._basket.addEventListener('click', () => {
			this.events.emit(PAGE_EVENTS.basketOpen);
		});
	}

	/** Устанавливаем элементы каталога */
	set catalog(items: HTMLElement[]) {
		this._catalog.replaceChildren(...items);
	}

	/** Устанавливаем значение счетчика */
	set counter(value: number) {
		this.setText(this._counter, String(value));
	}

	/** Управляем блокировкой страницы */
	set locked(value: boolean) {
		this._wrapper.classList.toggle('page__wrapper_locked', value);
	}
}
