import { IProduct } from "../types";
import { IEvents } from "./base/events";
import { Component } from "./common/Component";
import { ensureElement } from "../utils/utils";
import { formatPrice } from "./Card";

export class CardPreview extends Component<IProduct> {
    protected itemId: string;
    protected itemTitle: HTMLElement;
    protected itemImage: HTMLImageElement;
    protected itemPrice: HTMLElement;
    protected itemCategory: HTMLElement;
    protected itemDescription: HTMLElement;
    protected button: HTMLButtonElement;
  
    constructor(
      protected template: HTMLTemplateElement,
      protected events: IEvents
    ) {
      const node = template.content.firstElementChild.cloneNode(true) as HTMLElement;
      super(node);
  
      this.itemTitle = ensureElement<HTMLElement>('.card__title', this.container);
      this.itemImage = ensureElement<HTMLImageElement>('.card__image', this.container);
      this.itemPrice = ensureElement<HTMLElement>('.card__price', this.container);
      this.itemCategory = ensureElement<HTMLElement>('.card__category', this.container);
      this.itemDescription = ensureElement<HTMLElement>('.card__text', this.container);
      this.button = ensureElement<HTMLButtonElement>('.card__button', this.container);
  
      this.button.addEventListener('click', () => {
        this.events.emit('basket:add', { id: this.itemId });
        this.isInBasket = true;
      });
    }

    set id(value: string) {
        this.itemId = value;
    }

    set isInBasket(value: boolean) {
        if (value) {
            this.button.textContent = 'Товар в корзине';
            this.button.disabled = true;
        } else {
            this.button.textContent = 'В корзину';
            this.button.disabled = false;
        }
    }

    set category(value: string) {
        this.setText(this.itemCategory, value);

        const categoryClassMap: Record<string, string> = {
            'софт-скил': 'card__category_soft',
            'хард-скил': 'card__category_hard',
            'другое': 'card__category_other',
            'дополнительное': 'card__category_additional',
            'кнопка': 'card__category_button',
        };

        this.itemCategory.classList.remove(
            'card_category_soft',
            'card_category_hard',
            'card_category_other',
            'card_category_additional',
            'card_category_button'
        );

        const className = categoryClassMap[value];
        if (className) {
            this.itemCategory.classList.add(className);
        }
    }

    setInBasketState(isInBasket: boolean) {
        if (isInBasket) {
            this.button.disabled = true;
            this.setText(this.button, 'Товар в корзине');
        } else {
            this.button.disabled = false;
            this.setText(this.button, 'В корзину');
        }
    }
  
    render(data: IProduct): HTMLElement {
      this.itemTitle.textContent = data.title;
      this.itemImage.src = data.image;
      this.itemImage.alt = data.title;
      this.itemPrice.textContent = formatPrice(data.price);
      this.category = data.category;
      this.itemDescription.textContent = data.description;
      this.container.dataset.id = data.id;
      this.itemId = data.id;
      return this.container;
    }
  }
  