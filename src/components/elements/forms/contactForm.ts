import { Form } from '../../common/form';
import { IFormValidation, IOrderContacts } from '../../../types';
import { IEvents } from '../../base/events';

export class Contaсts extends Form<IOrderContacts> {
	constructor(formElement: HTMLFormElement, events: IEvents) {
		super(formElement, events);
	}

	set email(value: string) {
		(this.formElement.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}

	set phone(value: string) {
		(this.formElement.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	clearFields() {
		this.email = '';
		this.phone = '';
	}

	render(state: Partial<IOrderContacts> & IFormValidation): HTMLFormElement {
		const { valid, errors, email, phone } = state;

		super.render(state);

		this.email = email || '';
		this.phone = phone || '';

		this.FormValid = valid;
		this.errorMessage = errors ? errors.join('; ') : '';

		return this.formElement;
	}

}
