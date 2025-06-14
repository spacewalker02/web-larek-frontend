import { IEvents } from "./events";
import { IForm, IOrder, IUser } from "../../types";

export class OrderModel {
    private data: Partial<IOrder> = {};
    private form: IForm = {
        address: '',
        payment: null
      };

    setForm(form: IForm) {
        this.data.payment = form.payment;
        this.data.address = form.address;
    }

    setUser(user: IUser) {
        this.data.email = user.email;
        this.data.phone = user.phone;
    }

    setItems(items: string[]) {
        this.data.items = items;
    }

    setTotal(total: number) {
        this.data.total = total;
    }

    setAddress(address: string): void {
        this.form.address = address;
    }

    setPayment(payment: 'card' | 'cash'): void {
        this.form.payment = payment;
    }

    getOrder(): IOrder | null {
        if (
            this.data.address && this.data.email &&
            this.data.items && this.data.payment &&
            this.data.phone && typeof this.data.total === 'number'
        ) {
            return this.data as IOrder;
        } else {
            return null;
        }
    }

    getForm(): IForm {
        return {
          address: this.form.address ?? '',
          payment: this.form.payment ?? null,
        };
      }

    clear() {
        this.data = {};
    }

    validate() {
        const errors: string[] = [];

        if (!this.form.address) {
            errors.push('Bведите адрес');
        }
        if (!this.form.payment) {
            errors.push('Введите способ оплаты');
        }

        return errors;
    }

    validateContacts(data: IUser): string[] {
        const errors: string[] = [];

        if (!data.email.trim()) {
            errors.push('Введите email');
        }
        if (!data.phone.trim()) {
            errors.push('Введите телефон');
        }

        return errors;
    }
}