import { IOrderItem } from "@application/DTOs/order-item.interface";

export const makeOrderItem = (id: number, totalPrice: number): IOrderItem => ({
    id,
    productName: `Item ${id}`,
    quantity: 1,
    productId: 1,
    productPrice: totalPrice,
    totalPrice,
    orderId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
});