export abstract class Component<T> {
	protected constructor(protected readonly container: HTMLElement) {}

	/** Переключает класс у элемента */
	toggleClass(element: HTMLElement, className: string): void {
		element?.classList.toggle(className);
	}

	/** Устанавливает текстовое содержимое элемента */
	protected setText(element: HTMLElement | null, value: unknown): void {
		if (element) {
			element.textContent = String(value ?? '');
		}
	}

	/** Устанавливает состояние disabled у элемента */
	setDisabled(element: HTMLElement | null, state: boolean): void {
		element?.toggleAttribute('disabled', state);
	}

	/** Отображает элемент */
	protected setVisible(element: HTMLElement | null): void {
		if (element) {
			element.style.display = '';
		}
	}

	/** Скрывает элемент */
	protected setHidden(element: HTMLElement | null): void {
		if (element) {
			element.style.display = 'none';
		}
	}

	/** Устанавливает изображение с src и alt */
	protected setImage(element: HTMLImageElement | null, src: string, alt?: string): void {
		if (element) {
			element.src = src;
			element.alt = alt;
		}
	}

	/** Рендерит контейнер и обновляет состояние компонента */
	render(data?: Partial<T>): HTMLElement {
		if (data) {
			Object.assign(this, data);
		}
		return this.container;
	}
}
