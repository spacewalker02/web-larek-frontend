export type ApiListResponse<T> = {
    total: number;
    items: T[];
  };

export interface IProduct {
    id: string;
    title: string;
    price: number | null;
    category: string;
    image: string;
    description?: string;
}

export interface ICatalog {
    items: IProduct[];
    getItem(id: string): IProduct | undefined;
}

export interface ICatalogModel extends ICatalog {
    setItems(items: IProduct[]): void;
  }

export interface IForm {
    payment: 'card' | 'cash';
    address: string;
}

export interface IUser {
    email: string;
    phone: string;
}

export interface IOrder {
    email: string;
    phone: string;
    address: string;
    payment: 'card' | 'cash';
    items: string[];
    total: number;
}

export interface IBasketItem {
	id: string;
	title: string;
	price: number;
}

export interface IBasket {
	items: Map<string, IBasketItem>;
	remove(id: string): void;
}

export interface IBasketModel extends IBasket {
    addToBasket(id: string): void;
    removeFromBasket(id: string): void;
    clear(): void;
  }

export interface IEventEmitter {
    emit(event: string, ...args: any[]): void;
}

export interface ILarekApi {
    getItems: () => Promise<IProduct[]>;
    createOrder: (order: IOrder) => Promise<void>;
}

export interface IView {
    render(data?: object): HTMLElement;
}

export interface IViewConstructor {
    new (container: HTMLElement, events?: IEventEmitter): IView;
  }