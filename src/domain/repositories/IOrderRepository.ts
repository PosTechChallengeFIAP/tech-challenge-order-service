import { IOrderToCreate } from "@application/DTOs/order-to-create.interface";
import { IOrder } from "@application/DTOs/order.interface";

export interface IOrderRepository {
    findAll(): Promise<IOrder[]>;
    findById(id: number): Promise<IOrder | null>;
    save(order: IOrderToCreate): Promise<IOrder>;
    update(order: Partial<IOrder>): Promise<IOrder>;
}