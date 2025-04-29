import { IOrder } from "@application/DTOs/order.interface";

export interface IOrderRepository {
    findAll(): Promise<IOrder[]>;
    findById(id: number): Promise<IOrder | null>;
}