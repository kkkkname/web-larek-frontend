import { Component } from '../base/component';
import { ICard, ICardAction, ProductCategory } from '../../types';
import { currency, ensureElement } from '../../utils/utils';
import { settings } from '../../utils/constants';

export class Card extends Component<ICard> {
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _image: HTMLImageElement;
	protected _category: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _description: HTMLElement;
	protected _index: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardAction) {
		super(container);
		// Находим и инициализируем все необходимые элементы
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._image = container.querySelector('.card__image') as HTMLImageElement;
		this._category = container.querySelector('.card__category') as HTMLElement;
		this._button = container.querySelector('.card__button') as HTMLButtonElement;
		this._description = container.querySelector('.card__text') as HTMLElement;
		this._index = container.querySelector('.basket__item-index') as HTMLElement;

		// Если передан обработчик для клика, привязываем его
		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	// Метод для получения категории в виде класса
	private getCategory(value: ProductCategory): string {
		const category = settings[value] || 'unknown';
		return 'card__category_' + category;
	}

	// Устанавливаем название товара
	set title(value: string) {
		this._title.textContent = value;
	}

	// Устанавливаем цену товара и отключаем кнопку, если цена равна нулю
	set price(value: number | null) {
		this._price.textContent = currency(value);
		if (!value) {
			this.setDisabled(this._button, true);
		}
	}

	// Устанавливаем изображение товара
	set image(value: string) {
		if (this._image) {
			this.setImage(this._image, value, this.title);
		}
	}

	// Устанавливаем категорию товара и применяем соответствующий класс
	set category(value: ProductCategory) {
		if (this._category) {
			this._category.textContent = value;
			const bgColorClass = this.getCategory(value);
			this._category.className = 'card__category ' + bgColorClass;
		}
	}

	// Устанавливаем описание товара
	set description(value: string) {
		this._description.textContent = value;
	}

	// Устанавливаем состояние кнопки
	set inBasket(isInBasket: boolean) {
		if (this._button) {
			this._button.textContent = isInBasket ? 'Убрать' : 'В корзину'; // Меняем текст кнопки в зависимости от состояния
		}
	}

	// Устанавливаем индекс товара в корзине
	set index(value: number) {
		this._index.textContent = String(value);
	}
}
