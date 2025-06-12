import { IProduct } from "../../types";
import { IEvents } from "./events";

export class CatalogModel {
    protected items: IProduct[] = [];

    constructor(protected events: IEvents) {};

    getItems(): IProduct[] {
        return this.items
    };

    setItems(items: IProduct[]) {
        this.items = items;
        this.events.emit('catalog:updated', items);
    };

    getItemById(id: string): IProduct {
        const item = this.items.find((item) => item.id === id);
        if (!item) {
          throw new Error(`Product with id ${id} not found`);
        }
        return item;
      }
}