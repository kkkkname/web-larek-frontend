import { IFormValidation } from '../../types';
import { Component } from '../base/component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { FORM_SELECTORS, FORM_EVENTS, FORM_EVENT_PREFIX } from '../../utils/constants';

export abstract class Form<T> extends Component<IFormValidation> {
	protected _submit: HTMLButtonElement;
	protected _errors: HTMLElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);

		// Инициализация элементов
		this._submit = ensureElement<HTMLButtonElement>(FORM_SELECTORS.submitButton, this.container);
		this._errors = ensureElement<HTMLElement>(FORM_SELECTORS.errorContainer, this.container);

		// Подписка на события ввода
		this.container.addEventListener(FORM_EVENTS.input, (e: Event) => {
			const target = e.target as HTMLInputElement;
			const field = target.name as keyof T;
			const value = target.value;
			this.onInputChange(field, value);
		});

		this.container.addEventListener(FORM_EVENTS.submit, (e: Event) => {
			e.preventDefault();
			this.events.emit(`${this.container.name}${FORM_EVENT_PREFIX}`);
		});
	}

	protected onInputChange(field: keyof T, value: string) {
		this.events.emit(`${this.container.name}.${String(field)}:change`, {
			field, value
		});
	}

	set valid(value: boolean) {
		this._submit.disabled = !value;
	}

	set errors(value: string) {
		this.setText(this._errors, value);
	}

	render(state: Partial<T> & IFormValidation) {
		const { valid, errors, ...inputs } = state;
		super.render({ valid, errors });
		Object.assign(this, inputs);
		return this.container;
	}

	abstract clearFields(): void;
}
