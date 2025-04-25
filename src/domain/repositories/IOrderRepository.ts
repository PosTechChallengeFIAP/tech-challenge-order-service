import { IOrder } from "@application/DTOs/order.interface";

export interface IOrderRepository {
    findAll(): Promise<IOrder[]>;
}