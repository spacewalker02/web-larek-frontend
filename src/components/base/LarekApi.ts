import { IOrder, IOrderResponse, IProduct } from "../../types";
import { Api, ApiListResponse } from "./api";

export interface ILarekApi {
    getItemList: () => Promise<IProduct[]>;
    getItem: (id: string) => Promise<IProduct>;
    createOrder: (order: IOrder) => Promise<IOrderResponse>;
}

export class LarekApi extends Api implements ILarekApi {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getItem(id: string): Promise<IProduct> {
        return this.get(`/product/${id}`).then(
            (item: IProduct) => ({
                ...item,
                image: this.cdn + item.image,
            })
        );
    }

    getItemList(): Promise<IProduct[]> {
        return this.get('/product').then((data: ApiListResponse<IProduct>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image,
            }))
        );
    }

    createOrder(order: IOrder): Promise<IOrderResponse> {
        return this.post('/order', order).then(
            (data: IOrderResponse) => data
        );
    }
}