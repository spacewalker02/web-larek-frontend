import { IEvents } from "./events";

export class BasketModel {
    protected items: string[] = [];
  
    constructor(private events: IEvents) {}
  
    addItem(id: string): boolean {
      if (!this.items.includes(id)) {
        this.items.push(id);
        this.events.emit('basket:change', this.items);
        return true;
      }
      return false;
    }
  
    removeItem(id: string) {
      this.items = this.items.filter(item => item !== id);
      this.events.emit('basket:change', this.items);
    }
  
    getItems(): string[] {
      return Array.from(this.items);
    }
  
    clear() {
      this.items = [];
      this.events.emit('basket:clear');
    }

    hasItem(id: string): boolean {
        return this.items.includes(id);
      }
  }
  