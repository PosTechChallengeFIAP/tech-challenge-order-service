import { IOrderItemToCreate } from "@application/DTOs/order-item-to-create.interface";
import { IOrderItem } from "@application/DTOs/order-item.interface";

export interface IOrderItemRepository {
    saveAll(orderItems: IOrderItemToCreate[]): Promise<IOrderItem[]>;
    save(orderItem: IOrderItemToCreate): Promise<IOrderItem>;
}