import { Form } from '../../common/form';
import { IFormValidation, IOrderContacts, IOrderPayment } from '../../../types';
import { IEvents } from '../../base/events';

export class Order extends Form<IOrderPayment> {
	protected buttons: HTMLButtonElement[] = [];
	constructor(formElement: HTMLFormElement, events: IEvents) {
		super(formElement, events);

		this.buttons = [
			formElement.elements.namedItem('card') as HTMLButtonElement,
			formElement.elements.namedItem('cash') as HTMLButtonElement,
		];

		this.buttons.forEach((button) => {
			button.addEventListener('click', () => {
				this.buttons.forEach((item) =>
					item.classList.remove('button_alt-active')
				);
				button.classList.add('button_alt-active');
				this.updateField('payment', button.name);
			});
		});
	}

	set address(value: string) {
		(this.formElement.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}

	set payment(value: string) {
		const button = this.buttons.find((button, index, arr) => {
			return button.name === value;
		});
		if (button) {
			button.classList.add('button_alt-active');
			this.updateField('payment', button.name);
		}
	}

	clearFields() {
		this.address = '';
		this.payment = '';
		this.buttons.forEach((button) =>
			button.classList.remove('button_alt-active')
		);
	}

	render(state: Partial<IOrderPayment> & IFormValidation): HTMLFormElement {
		const { valid, payment, address, errors } = state;

		super.render(state);

		this.address = payment || '';
		this.payment = address || '';

		this.FormValid = valid;
		this.errorMessage = errors ? errors.join('; ') : '';

		return this.formElement;
	}
}