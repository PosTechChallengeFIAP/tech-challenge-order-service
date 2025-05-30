import { IOrder } from "./order.interface";

export interface IOrderItem {
    id: number;
    order: IOrder;
    productId: number;
    productName: string;
    productPrice: number;
    quantity: number;
    totalPrice: number;
    createdAt: Date;
    updatedAt: Date;
}