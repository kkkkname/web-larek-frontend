import { IFormValidation } from '../../types';
import { Component } from '../base/component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';


export abstract class Form<T> extends Component<IFormValidation> {
	protected submitButton: HTMLButtonElement;
	protected errorContainer: HTMLElement;

	constructor(protected formElement: HTMLFormElement, protected events: IEvents) {
		super(formElement);

		// Инициализация элементов
		this.submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', this.formElement);
		this.errorContainer = ensureElement<HTMLElement>('.form_errors', this.formElement);

		// Подписка на события ввода
		this.formElement.addEventListener('input', this.handleInput.bind(this));
	}

	/**
	 * Обработчик событий ввода
	 */
	private handleInput(event: Event): void {
		event.preventDefault();
		this.events.emit(`${this.formElement.name}:submit`);
	}

	/**
	 * Обновление значения поля ввода
	 */
	protected updateField(field: keyof T, value: string): void {
		this.events.emit(`${this.formElement.name}.${String(field)}:change`, { field, value });
	}

	/**
	 * Устанавливает состояние кнопки отправки формы
	 */
	set isFormValid(isValid: boolean) {
		this.submitButton.disabled = !isValid;
	}

	/**
	 * Отображает сообщение об ошибке в форме
	 */
	set errorMessage(message: string) {
		this.setText(this.errorContainer, message);
	}

	/**
	 * Рендерит состояние формы.
	 */
	render(state: Partial<T> & IFormValidation): HTMLFormElement {
		const { valid, errors, ...fields } = state;

		// Обновление состояния в базовом компоненте
		super.render({ valid, errors });

		// Присваивание значений полям формы
		Object.assign(this, fields);
		return this.formElement;
	}

	/**
	 * Очищает значения полей формы.
	 */
	abstract clearFields(): void;
}
