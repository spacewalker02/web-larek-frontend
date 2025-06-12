import { IUser } from '../types';
import { Component } from './common/Component';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

export class ContactsView extends Component<IUser> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;
    protected submitButton: HTMLButtonElement;

    constructor(protected template: HTMLTemplateElement, protected events: IEvents) {
        const node = template.content.firstElementChild.cloneNode(true) as HTMLFormElement;
        super(node);

        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', node);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', node);
		this.submitButton = ensureElement<HTMLButtonElement>('.modal__actions .button', node);

		this.submitButton.disabled = true;

        node.addEventListener('input', () => this.validate());

        node.addEventListener('submit', (event) => {
            event.preventDefault();

            if (this.validate()) {
                this.events.emit('order:complete', {
                    email: this.emailInput.value.trim(),
                    phone: this.phoneInput.value.trim(),
                });
            }
        });
    }

    validate(): boolean {
        const isValid = this.emailInput.value.trim() !== '' && this.phoneInput.value.trim() !== '';
        this.submitButton.disabled = !isValid;
        return isValid;
    }

    set user(data: IUser) {
        this.emailInput.value = data.email ?? '';
        this.phoneInput.value = data.phone ?? '';
        this.validate();
    }

    render(): HTMLElement {
        return this.container;
    }
}