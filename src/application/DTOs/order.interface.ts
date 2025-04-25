import { EOrderStatus } from "@domain/models/order-status.enum";
import { IOrderItem } from "./order-item.interface";

export interface IOrder {
    id: number;
    paymentId: number;
    pdvId: number;
    pdvName: string;
    clientId?: number;
    orderItems: IOrderItem[];
    createdAt: Date;
    updatedAt: Date;

    getPrice(): number;
    getStatus(): EOrderStatus;
    addItem(orderItem: IOrderItem): void;
    removeItem(id: number): void;
    setStatus(status: EOrderStatus): void;
}