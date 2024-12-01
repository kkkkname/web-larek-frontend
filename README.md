# Проектная работа "Веб-ларек"
# MVP Архитектура

Этот проект реализует архитектуру MVP (Model-View-Presenter), которая разделяет логику приложения на три слоя:
- **Model** — управляет данными и бизнес-логикой.
- **View** — отвечает за отображение данных и взаимодействие с пользователем.
- **Presenter** — связывает модель и представление, обрабатывает действия пользователя.

## Содержание
1. [Model](#model)
2. [View](#view)
3. [Presenter](#presenter)
4. [Установка](#установка-и-запуск)
5. [Используемые технологии](#используемые-технологии)

---

## Model

Модель управляет данными и бизнес-логикой, выполняет валидацию и обработку ошибок. Все данные, такие как список товаров, корзина, информация о заказе, хранятся в модели.

### Классы и методы:
#### **AppState** (Основной класс модели)
- **Поля**:
    - `catalog: IProduct[]` — Массив товаров в каталоге.
    - `basket: IProduct[]` — Массив товаров в корзине.
    - `order: IOrder` — Объект заказа с контактными данными и товарами.
    - `orderPaymentError: OrderPaymentError` — Ошибки валидации платежных данных.
    - `orderContactError: OrderContactError` — Ошибки валидации контактных данных.
    - `savedOrderState: Partial<IOrder>` — Сохраненное состояние заказа.
    - `savedOrderPaymentErrors: OrderPaymentError` — Сохраненные ошибки платежа.
    - `savedOrderContactsErrors: OrderContactError` — Сохраненные ошибки контактных данных.

- **Методы**:
    - `setCatalog(items: IProduct[])`: Устанавливает каталог товаров.
    - `addBasket(item: IProduct)`: Добавляет товар в корзину.
    - `removeBasket(item: IProduct)`: Удаляет товар из корзины.
    - `isInBasket(item: IProduct): boolean`: Проверяет, есть ли товар в корзине.
    - `getNumberBasket(): number`: Возвращает количество товаров в корзине.
    - `getTotalBasket(): number`: Возвращает общую стоимость корзины.
    - `setField(field: keyof IForm, value: string)`: Устанавливает значение поля формы заказа.
    - `validate(formType: FormName): boolean`: Валидация формы заказа или контактных данных.
    - `cleanOrder()`: Очищает состояние заказа.
    - `cleanBasketState()`: Очищает корзину.
    - `prepareOrder()`: Подготавливает заказ, устанавливая общую сумму и список товаров.
    - `getOrderData(): IOrder`: Возвращает данные заказа.
    - `getAddress(): string`: Возвращает адрес.
    - `getPayment(): string`: Возвращает способ оплаты.
    - `getEmail(): string`: Возвращает email.
    - `getPhone(): string`: Возвращает номер телефона.
    - `saveOrderState()`: Сохраняет текущее состояние заказа.
    - `restoreOrderState()`: Восстанавливает сохраненное состояние заказа.

---

## View

Представление отвечает за отображение данных пользователю и обработку действий с интерфейсом. Компоненты в этом слое принимают изменения данных и отображают их, а также отправляют события в Presenter.

### Классы и методы:
#### **Basket**
- **Поля**:
    - `_list: HTMLElement` — Элемент для отображения списка товаров.
    - `_total: HTMLElement` — Элемент для отображения общей суммы корзины.
    - `_button: HTMLElement` — Кнопка для оформления заказа.

- **Методы**:
    - `set items(items: HTMLElement[])`: Устанавливает товары в корзине (если пусто, отображает сообщение).
    - `set total(total: number)`: Устанавливает общую стоимость корзины.
    - `disableButton(disabled: boolean)`: Отключает или включает кнопку.

#### **Card**
- **Поля**:
    - `_title: HTMLElement` — Название товара.
    - `_price: HTMLElement` — Цена товара.
    - `_image: HTMLImageElement` — Изображение товара.
    - `_category: HTMLElement` — Категория товара.
    - `_button: HTMLButtonElement` — Кнопка для добавления товара в корзину.
    - `_description: HTMLElement` — Описание товара.
    - `_index: HTMLElement` — Индекс товара.

- **Методы**:
    - `set title(value: string)`: Устанавливает название товара.
    - `set price(value: number | null)`: Устанавливает цену товара.
    - `set image(value: string)`: Устанавливает изображение товара.
    - `set category(value: ProductCategory)`: Устанавливает категорию товара.
    - `set description(value: string)`: Устанавливает описание товара.
    - `set inBasket(isInBasket: boolean)`: Устанавливает состояние кнопки (добавить в корзину или в корзине).
    - `set index(value: number)`: Устанавливает индекс товара.

#### **OrderSuccess**
- **Поля**:
    - `_button: HTMLButtonElement` — Кнопка для подтверждения оформления заказа.
    - `_description: HTMLElement` — Элемент для отображения суммы заказа.

- **Методы**:
    - `set total(value: number)`: Устанавливает общую сумму заказа.

#### **Page**
- **Поля**:
    - `_counter: HTMLElement` — Элемент для отображения счетчика товаров в корзине.
    - `_catalog: HTMLElement` — Элемент для отображения каталога товаров.
    - `_wrapper: HTMLElement` — Обертка для блокировки страницы.
    - `_basket: HTMLElement` — Элемент для отображения корзины.

- **Методы**:
    - `set catalog(items: HTMLElement[])`: Устанавливает товары в каталоге.
    - `set counter(value: number)`: Устанавливает счетчик товаров в корзине.
    - `set locked(value: boolean)`: Управляет блокировкой страницы.

---
## Presenter

Презентер связывает модель и представление, обрабатывает действия пользователя и обновляет данные. Он отвечает за обработку событий от представления и работу с моделью.

### Классы и методы:
#### **Page**
- Обработчик клика по корзине:
```typescript
  this._basket.addEventListener('click', () => {
      this.events.emit(PAGE_EVENTS.basketOpen);
  });
```
#### **Basket**
- Обработчик клика на кнопку оформления заказа:
```typescript
this._button.addEventListener('click', () => {
    this.events.emit('order:open');
});
```
#### **OrderSuccess**
- Обработчик клика на кнопку подтверждения заказа:
```typescript
this._button.addEventListener('click', () => {
    this.events.emit(ORDER_SUCCESS_EVENTS.submit);
});
```
### **Card**
- Обработчик клика на кнопку добавления в корзину:
```typescript
this._button.addEventListener('click', actions.onClick);
```

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Используемые технологии
Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами