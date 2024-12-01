import { IFormValidation, IOrderPayment } from '../../../types';
import { IEvents } from '../../base/events';
import { Form } from '../../common/form';
import { ORDER_SELECTORS, ORDER_CLASSES } from '../../../utils/constants';

export class Order extends Form<IOrderPayment> {
	protected buttons: HTMLButtonElement[] = [];
	protected submitButton: HTMLButtonElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this.buttons = [
			container.elements.namedItem(ORDER_SELECTORS.cardButton) as HTMLButtonElement,
			container.elements.namedItem(ORDER_SELECTORS.cashButton) as HTMLButtonElement,
		];

		this.submitButton = container.elements.namedItem(ORDER_SELECTORS.submitButton) as HTMLButtonElement;
		this.submitButton.disabled = true;

		this.buttons.forEach((button) => {
			button.addEventListener('click', () => {
				this.buttons.forEach((item) =>
					item.classList.remove(ORDER_CLASSES.buttonActive)
				);
				button.classList.add(ORDER_CLASSES.buttonActive);
				this.onInputChange('payment', button.name);
				this.toggleFormState();
			});
		});

		const addressInput = container.elements.namedItem(ORDER_SELECTORS.addressInput) as HTMLInputElement;
		addressInput.addEventListener('input', () => {
			this.onInputChange('address', addressInput.value);
			this.toggleFormState();
		});
	}

	set address(value: string) {
		(this.container.elements.namedItem(ORDER_SELECTORS.addressInput) as HTMLInputElement).value = value;
		this.toggleFormState();
	}

	set payment(value: string) {
		const currentButton = this.buttons.find((button) => button.name === value);
		if (currentButton) {
			currentButton.classList.add(ORDER_CLASSES.buttonActive);
			this.onInputChange('payment', currentButton.name);
		}
		this.toggleFormState();
	}

	clearFields() {
		this.address = '';
		this.payment = '';
		this.buttons.forEach((button) =>
			button.classList.remove(ORDER_CLASSES.buttonActive)
		);
		this.submitButton.disabled = true;
	}

	render(state: Partial<IOrderPayment> & IFormValidation) {
		super.render(state);
		this.address = state.address || '';
		this.payment = state.payment || '';
		this.valid = state.valid;
		this.errors = state.errors.join('; ');
		this.toggleFormState();
		return this.container;
	}

	private toggleFormState() {
		const address = (this.container.elements.namedItem(ORDER_SELECTORS.addressInput) as HTMLInputElement).value;
		const hasActivePayment = this.buttons.some((button) =>
			button.classList.contains(ORDER_CLASSES.buttonActive)
		);

		this.submitButton.disabled = !(address.trim() && hasActivePayment);
	}
}
