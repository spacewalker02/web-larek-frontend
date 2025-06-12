import { IBasketItem } from "../types";
import { Component } from "./common/Component";
import { IEvents } from "./base/events";
import { ensureElement } from "../utils/utils";
import { formatPrice } from "./Card";

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

    set items(items: IBasketItem[]) {
        this.itemList.innerHTML = '';
        let total = 0;

        items.forEach((item, index) => {
            const basketItemTemplate = document.querySelector<HTMLTemplateElement>('#card-basket');
            const basketContentTemplate = basketItemTemplate.content;
            const basketItemElement = basketContentTemplate.firstElementChild;
            const itemNode = basketItemElement.cloneNode(true) as HTMLElement;

            this.setText(itemNode.querySelector('.basket__item-index'), String(index + 1));
            this.setText(itemNode.querySelector('.card__title'), item.title);
            this.setText(itemNode.querySelector('.card__price'), formatPrice(item.price));

            const deleteBtn = itemNode.querySelector('.basket__item-delete') as HTMLButtonElement;
            deleteBtn.addEventListener('click', () => {
                this.events.emit('basket:remove', { id: item.id });
            });

            this.itemList.appendChild(itemNode);
            total += item.price ?? 0;

            this.disabled = items.length === 0;
        });

        this.total = total;
    }

    set disabled(value: boolean) {
        this.basketButton.disabled = value;
      }
}