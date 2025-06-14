import { IBasketItem } from "../types";
import { Component } from "./common/Component";
import { IEvents } from "./base/events";
import { ensureElement } from "../utils/utils";
import { formatPrice } from "../utils/utils";

export class BasketView extends Component<IBasketItem> {
    protected basketTitle: HTMLElement;
    protected itemList: HTMLElement;
    protected basketButton: HTMLButtonElement;
    protected totalSum: HTMLElement;

    constructor(protected template: HTMLTemplateElement, protected events: IEvents) {
        const node = template.content.firstElementChild.cloneNode(true) as HTMLElement;
        super(node);

        this.basketTitle = ensureElement<HTMLElement>('.modal__title', node);
        this.itemList = ensureElement<HTMLElement>('.basket__list', node);
        this.basketButton = ensureElement<HTMLButtonElement>('.basket__button', node);
        this.totalSum = ensureElement<HTMLElement>('.basket__price', node);

        this.basketButton.addEventListener('click', () => {
            this.events.emit('order: submit');
        });
    }

    set title(value: string) {
        this.setText(this.basketTitle, value);
    }

    set total(value: number | null) {
        this.setText(this.totalSum, formatPrice(value));
    }

    set items(items: HTMLElement[]) {
        this.itemList.innerHTML = '';
        items.forEach((itemNode) => {
            this.itemList.appendChild(itemNode);
        });
        this.disabled = items.length === 0;
    }

    set disabled(value: boolean) {
        this.basketButton.disabled = value;
      }
}