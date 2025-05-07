import { IOrder } from "./order.interface";

export interface IOrderItemToCreate {
    productId: number;
    productName: string;
    productPrice: number;
    quantity: number;
    totalPrice: number;
    order: IOrder
}