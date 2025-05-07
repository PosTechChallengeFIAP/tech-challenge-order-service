import { IOrderItem } from "@application/DTOs/order-item.interface";
import { IOrder } from "@application/DTOs/order.interface";

export class OrderItem implements IOrderItem {
    id: number;
    order: IOrder;
    productId: number;
    productName: string;
    productPrice: number;
    quantity: number;
    totalPrice: number;
    createdAt: Date;
    updatedAt: Date;

    constructor(
        id: number,
        order: IOrder,
        productId: number,
        productName: string,
        productPrice: number,
        quantity: number,
        createdAt: Date,
        updatedAt: Date,
    ) {
        this.id = id;
        this.order = order;
        this.productId = productId;
        this.productName = productName;
        this.productPrice = productPrice;
        this.quantity = quantity;
        this.totalPrice = this.quantity * this.productPrice;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}