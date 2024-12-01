import { Form } from '../../common/form';
import { IFormValidation, IOrderContacts } from '../../../types';
import { IEvents } from '../../base/events';

export class Contacts extends Form<IOrderContacts> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
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

		this.valid = valid;
		this.errors = errors ? errors.join(`; `) : '';

		return this.container;
	}

}
