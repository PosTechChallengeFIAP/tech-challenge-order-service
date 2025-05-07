import { EOrderStatus } from "@domain/models/order-status.enum";
import { IOrderItem } from "./order-item.interface";

export interface IOrder {
    id: number;
    pdvId: number;
    pdvName: string;
    clientId?: number;
    orderItems: IOrderItem[];
    createdAt: Date;
    updatedAt: Date;
    status: EOrderStatus;
}