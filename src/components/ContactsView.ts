import { IUser } from '../types';
import { Component } from './common/Component';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

export class ContactsView extends Component<IUser> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;
    protected submitButton: HTMLButtonElement;
    protected errorField: HTMLElement;

    constructor(protected template: HTMLTemplateElement, protected events: IEvents) {
        const node = template.content.firstElementChild.cloneNode(true) as HTMLFormElement;
        super(node);

        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', node);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', node);
		this.submitButton = ensureElement<HTMLButtonElement>('.modal__actions .button', node);
        this.errorField = ensureElement<HTMLElement>('.form__errors', node);

		this.submitButton.disabled = true;

        node.addEventListener('input', () => {
            this.events.emit('contacts: change', {
                email: this.emailInput.value.trim(),
                phone: this.phoneInput.value.trim(),
            });
        });

        node.addEventListener('submit', (event) => {
            event.preventDefault();

            this.events.emit('order:complete', {
                email: this.emailInput.value.trim(),
                phone: this.phoneInput.value.trim(),
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