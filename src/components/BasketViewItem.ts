import { IBasketItem } from "../types";
import { ensureElement, formatPrice } from "../utils/utils";
import { IEvents } from "./base/events";
import { Component } from "./common/Component";

export class BasketViewItem extends Component<IBasketItem> {
    protected indexElement: HTMLElement;
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected buttonDltElement: HTMLButtonElement;

    constructor(template: HTMLTemplateElement, item: IBasketItem, index: number, events: IEvents) {
        const node = template.content.firstElementChild.cloneNode(true) as HTMLElement;
        super(node);

        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', node);
        this.titleElement = ensureElement<HTMLElement>('.card__title', node);
        this.priceElement = ensureElement<HTMLElement>('.card__price', node);
        this.buttonDltElement = ensureElement<HTMLButtonElement>('.basket__item-delete', node);

        this.setText(this.indexElement, String(index + 1));
		this.setText(this.titleElement, item.title);
		this.setText(this.priceElement, formatPrice(item.price));

        this.buttonDltElement.addEventListener('click', () => {
			events.emit('basket:remove', { id: item.id });
		});
    }
}