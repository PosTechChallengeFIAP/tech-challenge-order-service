import { IOrder } from "@application/DTOs/order.interface";
import { EOrderStatus } from "@domain/models/order-status.enum";

export type TUpdateOrderStatusUseCaseRequest = {
    orderId: number;
    status: EOrderStatus;
}

export type TUpdateOrderStatusUseCaseResponse = IOrder;