import { Component } from "./common/Component";
import { IProduct } from "../types";
import { ensureElement } from "../utils/utils";
import { IEvents } from "./base/events";

export function formatPrice(value: number | null): string {
    if (typeof value === 'number') {
      return `${value} синапсов`;
    } else {
      return 'Бесценно';
    }
  }
  
export class Card extends Component<IProduct> {
    protected itemTitle: HTMLElement;
    protected itemImage: HTMLImageElement;
    protected itemPrice: HTMLElement;
    protected itemCategory: HTMLElement;
    protected itemId: number;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.itemTitle = ensureElement<HTMLElement>('.card__title', this.container);
		this.itemPrice = ensureElement<HTMLElement>('.card__price', this.container);
		this.itemCategory = ensureElement<HTMLElement>('.card__category', this.container);
		this.itemImage = ensureElement<HTMLImageElement>('.card__image', this.container);
		
		this.container.addEventListener('click', () => this.events.emit('item:preview', {id: this.itemId}));
		}
		set title(value: string) {
			this.setText(this.itemTitle, value);
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

            this.container.classList.remove(
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
		
		set image(value: string) {
            const alt = this.itemTitle.textContent ?? '';
            this.setImage(this.itemImage, value, alt);
        }

        set price(value: number | null) {
            this.setText(this.itemPrice, formatPrice(value));
        }
    
        set id(value: number) {
	        this.itemId = value;
        }
    
        render(data: Partial<IProduct>): HTMLElement {
	        Object.assign(this as object, data);
	        return this.container;
        }
}
