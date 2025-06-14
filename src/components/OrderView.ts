import { IForm } from '../types';
import { Component } from './common/Component';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

export class OrderView extends Component<IForm> {
    protected buttons: NodeListOf<HTMLButtonElement>;
    protected addressInput: HTMLInputElement;
    protected submitButton: HTMLButtonElement;
    protected selectedPayment: 'card' | 'cash' | null = null;
    protected errorField: HTMLElement;

    constructor(protected template: HTMLTemplateElement, protected events: IEvents) {
        const node = template.content.firstElementChild.cloneNode(true) as HTMLElement;
        super(node);

        this.buttons = node.querySelectorAll('.order__buttons .button');
        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', node);
		this.submitButton = ensureElement<HTMLButtonElement>('.order__button', node);
        this.errorField = ensureElement<HTMLElement>('.form__errors', node);

		this.submitButton.disabled = true;

        this.buttons.forEach((button) => {
            button.addEventListener('click', () => {
                this.buttons.forEach((btn) => btn.classList.remove('button_alt-active'));
                button.classList.add('button_alt-active');
                this.selectedPayment = button.name as 'card' | 'cash';

                this.events.emit('payment: change', {
                    payment: this.selectedPayment
                });
            });
        });

        this.addressInput.addEventListener('input', () => {
            this.events.emit('address: change', {
                address: this.addressInput.value.trim(),
            });
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

    showError(message: string) {
        this.errorField.textContent = message;
    }

    setSubmitBtnDisabled(value: boolean) {
        this.submitButton.disabled = value;
    }

    render(): HTMLElement {
        return this.container;
    }
}