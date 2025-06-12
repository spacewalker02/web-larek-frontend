import { Component } from "./Component";
import {ensureElement} from "../../utils/utils";
import { IOrderResponse } from "../../types";
import { IEvents } from "../base/events";
import { formatPrice } from "../Card";


export class Success extends Component<IOrderResponse> {
    protected closeButton: HTMLButtonElement;
    protected successTitle: HTMLElement;
    protected successText: HTMLElement;

    constructor(protected template: HTMLTemplateElement, protected events: IEvents) {
        const node = template.content.firstElementChild.cloneNode(true) as HTMLFormElement;
        super(node);

        this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', node);
        this.successTitle = ensureElement<HTMLElement>('.order-success__title', node);
        this.successText = ensureElement<HTMLElement>('.order-success__description', node);

        this.closeButton.addEventListener('click', () => {
            this.events.emit('modal:close');
        });
    }

    set total(id: number) {
        this.setText(this.successText, `Списано ${formatPrice(id)}`);
      }
}