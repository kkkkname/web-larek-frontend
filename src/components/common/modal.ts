import { Component } from '../base/component';
import { IModal } from '../../types';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { MODAL_SELECTORS, MODAL_EVENTS, MODAL_ACTIVE_CLASS } from '../../utils/constants';

export class Modal extends Component<IModal> {
	protected closeButton: HTMLButtonElement;
	protected modalContent: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		// Инициализация элементов
		this.closeButton = ensureElement<HTMLButtonElement>(MODAL_SELECTORS.closeButton, container);
		this.modalContent = ensureElement<HTMLElement>(MODAL_SELECTORS.modalContent, container);

		// Обработка событий
		this.closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.close.bind(this));
		this.modalContent.addEventListener('click', (event) => event.stopPropagation());
	}

	/**
	 * Устанавливает контент модального окна
	 */
	set content(value: HTMLElement) {
		if (!value) {
			this.modalContent.innerHTML = ''; // Очистка содержимого
			return;
		}
		this.modalContent.replaceChildren(value);
	}

	/**
	 * Открывает модальное окно
	 */
	open(): void {
		this.container.classList.add(MODAL_ACTIVE_CLASS);
		this.events.emit(MODAL_EVENTS.open);
	}

	/**
	 * Закрывает модальное окно
	 */
	close(): void {
		this.container.classList.remove(MODAL_ACTIVE_CLASS);
		this.content = null; // Очистка содержимого
		this.events.emit(MODAL_EVENTS.close);
	}

	/**
	 * Рендерит модальное окно с заданными данными
	 */
	render(data: IModal): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}
