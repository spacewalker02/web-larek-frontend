import { IEvents } from "./events";
import { IForm, IOrder, IUser } from "../../types";

export class OrderModel {
    private data: Partial<IOrder> = {};

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

    clear() {
        this.data = {};
    }
}