import { Component } from '../base/component';
import { IModal } from '../../types';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

export class Modal extends Component<IModal> {
	protected closeButton: HTMLButtonElement;
	protected modalContent: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		// Инициализация элементов
		this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
		this.modalContent = ensureElement<HTMLElement>('.modal__content', container);

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
		this.container.classList.add('modal_active');
		this.events.emit('modal:open');
	}

	/**
	 * Закрывает модальное окно
	 */
	close(): void {
		this.container.classList.remove('modal_active');
		this.content = null; // Очистка содержимого
		this.events.emit('modal:close');
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
