# Проектная работа "Веб-ларек"

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
## Архитектура и ключевые компоненты

Проект построен по принципу разделения ответственности: каждый модуль отвечает только за свою зону ответственности, это облегчит поддержку, тестирование и развитие приложения.

### Каталог (Catalog)

Хранит и предоставляет данные обо всех товарах, позволяет получать список товаров и показывает отдельно каждый товар по модификатору. Описывается интерфейсами `ICatalog` и `IProduct`.

Расширенный интерфейс `ICatalogModel` устанавливает логику работы с каталогом.

### Корзина (Basket)

Предоставляет возможность добавлять и удалять товар, хранит элементы корзины. Действия с корзиной и ее возможности описаны через базовые интерфейсы `IBasketItem`, `IBasket`

Расширенная версия интерфейса `IBasketModel` отвечает за функциональность корзины.

### Оформление заказа (Order)

Собирает и валидирует данные пользователя (`IForm`, `IOrder`, `IUser`), обеспечивает переход к оплате, сохраняет информацию о способе оплаты, адресе, email и телефоне пользователя;

### EventEmitter

Событийный брокер и перечисление событий, с которыми работает приложение. Позволяет подписываться на события и отправлять оповещения между частями приложения, реализует шаблон “наблюдатель”. Таким образом, при добавлении товара в корзину, UI будет обновлять счетчик товара и уведомлять (показывать) пользователя.

У класса будут прописаны методы `on`, `off` и `emit`. On(event, listener) - подписка на событие, off - соответственно, отписка, и emit - вызов события. 

Примеры событий, которые будут реализованы в коде:

- `catalog:loaded` — загрузился каталог товаров
- `product:select` — пользователь открыл карточку товара
- `basket:add` — добавлен товар в корзину
- и т.д.

### API-клиент (LarekApi)

Обеспечивает запросы к серверу для получения каталога товаров и отправки заказа.

Класс LarekApi реализует API-клиент и обеспечит получение каталога товаров (`getItems`) и оформление заказов (`createOrder`). Всё сетевое взаимодействие с сервером инкапсулировано в этом классе.

В проекте также используется универсальный дженерик-тип `ApiListResponse<T>`, который позволяет типизировать ответы API, возвращающие коллекции данных.

**Структура ответа включает:**

- `total` — общее количество элементов;
- `items` — массив элементов типа `T`

**Пример использования:**

- Для списка товаров: `ApiListResponse<IProduct>`
- Для списка заказов: `ApiListResponse<IOrder>`

### Интерфейсы для отображения

`IView` - отвечает за отображение товаров на странице, а интерфейс `IViewConstructor` послужит для универсального создания интерфейсных компонентов.

Архитектура реализует принципы Model-View-Presenter (MVP), где данные, логика и отображение разделены и взаимодействуют между собой через событийную систему (EventEmitter). Это позволяет поддерживать, тестировать и при желании масштабировать проект.

## Модели (Models)

### BasketModel

**Назначение:** хранение данных о корзине пользователя и реализация методов для добавления и удаления товаров.

**Конструктор:** `constructor(initialItems?: Set<string>)`

**Поля:**

- `items: Set<string>` - содержит id товаров в корзине

**Методы:**

- `add(id: string): void` - добавить товар по id
- `remove(id: string): void` - уменьшить количество товара по id или удалить
- `clear(): void` - очистить корзину

### CatalogModel

**Назначение:** управление списком товаров (каталог), хранение и предоставление товаров по запросу.

**Конструктор:** `constructor(items?: IProduct[])`

**Поля:**

- `items: IProduct[]`

**Методы:**

- `setItems(items: IProduct[]): void` - обновить содержимое каталога
- `getItem(id: string): IProduct | undefined` - предоставить товар из внутреннего массива товаров, если он есть.

### OrderModel

**Назначение:** хранение и валидация данных оформления заказа пользователя.

**Конструктор:** `constructor(user?: IUser, form?: IForm)`

**Поля:**

- `user: IUser`
- `form: IForm`

**Методы:**

- `validate(): ValidationResult` - проверить корректность всех данных, которые есть в заказе.
- `setUser(user: IUser): void` - записать/обновить данные пользователя в текущем заказе.
- `setForm(form: IForm): void` - записать данные (способ оплаты и адрес доставки) из формы заказа

## Представления

### MainView

**Назначение:** отображает список товаров на главной странице, управляет контейнером, в котором выводятся карточки товаров, а также отображает кнопку открытия корзины и счётчик количества заказов.

**Конструктор:** `constructor(container: HTMLElement)`

**Поля:**

- `container: HTMLElement` - корневой элемент для списка товаров
- `basketCountElement: HTMLElement` - DOM-элемент счетчика корзины
- `basketButton: HTMLElement` — DOM-элемент кнопки открытия корзины

**Методы:**

- `render(products: IProduct[]): void` — отрисовать все товары на странице
- `updateBasketCount(count: number): void` — обновить счётчик корзины
- `bindEvents(): void` — навесить обработчики событий на кнопку “корзина”

### ModalView

**Назначение:** управляет отображением модального окна: открытие/закрытие, вставка нужного содержимого (success, preview карточки, оформление заказа и т.д.).

**Конструктор:** `constructor(container: HTMLElement)`

**Поля:**

- `container: HTMLElement` — DOM-элемент с id="modal-container"
- `content: HTMLElement` — содержимое модального окна

**Методы:**

- `open(content: HTMLElement): void` — отобразить модальное окно с указанным содержимым
- `close(): void` — закрыть модальное окно (очистить контейнер)
- `bindEvents(): void` — обработка событий закрытия по клику вне окна или на крестик

### SuccessView

**Назначение:** показывает модальное окно об успешном оформлении заказа.

**Конструктор:** `constructor(container: HTMLElement)`

**Поля:**

- `container: HTMLElement` - корневой элемент для модального окна.
- `element: HTMLElement` - ссылка на DOM-элемент окна.

**Методы:**

- `render(total: number): void` - отображает окно "Заказ успешно отправлен".
- `close(): void` - скрывает/удаляет окно.

### CardCatalogView

**Назначение:** отображает карточку товара, показывает информацию о товаре и позволяет добавить его в корзину.

**Конструктор:** `constructor(container: HTMLElement, emitter: EventEmitter)`

**Поля:**

- `container: HTMLElement` - родительский DOM-элемент, в который будет вставлена карточка.
- `element: HTMLElement` - ссылка на DOM-элемент карточки.
- `emitter: EventEmitter` - для отправки событий.

**Методы:**

- `render(product: IProduct): HTMLElement` - создает и возвращает DOM-элемент карточки на основе переданных данных.
- `bindEvents(): void` - добавляет слушатели событий

### СardPreviewView

**Назначение:** показывает модальное окно с подробной информацией о товаре и позволяет добавить его в корзину.

**Конструктор:** `constructor(container: HTMLElement, emitter: EventEmitter)`

**Поля:**

- `container: HTMLElement` - контейнер для вставки карточки
- `element: HTMLElement` - ссылка на DOM-элемент карточки.
- `emitter: EventEmitter` — брокер событий

**Методы:**

- `render(product: IProduct): HTMLElement` - формирует и возвращает карточку товара.
- `bindEvents(): void` - добавляет слушатели событий

### СardBasketView

**Назначение:** отображает карточку товара в корзине с возможностью удаления.

**Конструктор:** `constructor(container: HTMLElement, emitter: EventEmitter)`

**Поля:**

- `element: HTMLElement` - DOM-элемент карточки товара в корзине
- `container: HTMLElement` - контейнер для вставки карточки
- `emitter: EventEmitter` — брокер событий

**Методы:**

- `render(items: IBasketItem): HTMLElement` - создает и возвращает DOM-элемент карточки товара в корзине
- `bindEvents(): void` - добавляет слушатели

### BasketView

**Назначение:** контейнер для списка товаров в корзине и блока с итоговой стоимостью.

**Конструктор:** `(container: HTMLElement, emitter: EventEmitter)`

**Поля:**

- `element: HTMLElement` - DOM-элемент корзины (контейнер)
- `emitter: EventEmitter` — для отправки событий

**Методы:**

- `render(cards: HTMLElement[]): void` - отображает список карточек товаров в корзине
- `bindEvents(): void` - слушатели на кнопки оформления заказа и т.д.

### OrderView

**Назначение:** позволяет выбрать способ оплаты и вписать адрес пользователя для последующего оформления заказа, а также выполняет валидацию и отправку данных.

**Конструктор:** `(container: HTMLElement, emitter: EventEmitter)`

**Поля:**

- `emitter: EventEmitter` — брокер событий
- `element: HTMLElement` - DOM-элемент формы заказа
- `form: HTMLFormElement` - ссылка на DOM-форму
- `fields: { [key: string]: HTMLInputElement }` - ссылки на поля ввода

**Методы:**

- `render(user?: IUser): HTMLElement` - создает и возвращает DOM-элемент формы заказа
- `bindEvents(): void` - добавляет обработчики событий
- `showError(message: string): void` - показывает ошибку пользователю

### ContactsView

**Назначение:** позволяет вписать контактные данные пользователя, такие как телефон и email с последующей возможностью оформить заказ, а также выполняет валидацию и отправку данных.

**Конструктор:** `(container: HTMLElement, emitter: EventEmitter)`

**Поля:**

- `emitter: EventEmitter` — брокер событий
- `element: HTMLElement` - DOM-элемент формы заказа
- `form: HTMLFormElement` - ссылка на DOM-форму
- `fields: { [key: string]: HTMLInputElement }` - ссылки на поля ввода

**Методы:**

- `render(user?: IUser): HTMLElement` - создает и возвращает DOM-элемент формы заказа
- `bindEvents(): void` - добавляет обработчики событий
- `validate(): boolean` - проверяет корректность введенных данных
- `getData(): IOrder` - собирает данные из формы и возвращает объект заказа
- `showError(message: string): void` - показывает ошибку пользователю
