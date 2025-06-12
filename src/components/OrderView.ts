import { IForm } from '../types';
import { Component } from './common/Component';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

export class OrderView extends Component<IForm> {
    protected buttons: NodeListOf<HTMLButtonElement>;
    protected addressInput: HTMLInputElement;
    protected submitButton: HTMLButtonElement;
    protected selectedPayment: 'card' | 'cash' | null = null;

    constructor(protected template: HTMLTemplateElement, protected events: IEvents) {
        const node = template.content.firstElementChild.cloneNode(true) as HTMLElement;
        super(node);

        this.buttons = node.querySelectorAll('.order__buttons .button');
        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', node);
		this.submitButton = ensureElement<HTMLButtonElement>('.order__button', node);

		this.submitButton.disabled = true;

        this.buttons.forEach((button) => {
            button.addEventListener('click', () => {
                this.buttons.forEach((btn) => btn.classList.remove('button_alt-active'));
                button.classList.add('button_alt-active');
                this.selectedPayment = button.name as 'card' | 'cash';
                this.updateButtonState();
            });
        });

        this.addressInput.addEventListener('input', () => {
            this.updateButtonState();
            });

		node.addEventListener('submit', (event) => {
			event.preventDefault();
			if (!this.selectedPayment || !this.addressInput.value.trim()) return;

			this.events.emit('order:next', {
				payment: this.selectedPayment,
				address: this.addressInput.value.trim(),
            });
          });
    }

    updateButtonState() {
        this.submitButton.disabled = !(
            this.selectedPayment && this.addressInput.value.trim().length > 0
        );
    }

    render(): HTMLElement {
        return this.container;
    }
}