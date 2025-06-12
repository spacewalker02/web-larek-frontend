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
    payment?: 'card' | 'cash';
    items: string[];
    total?: number;
}

export interface IOrderResponse {
    id: string;
  }

export interface IBasketItem {
	id: string;
	title: string;
	price: number;
}