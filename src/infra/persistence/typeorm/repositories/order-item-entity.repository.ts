import { IOrderItemToCreate } from "@application/DTOs/order-item-to-create.interface";
import { IOrderItem } from "@application/DTOs/order-item.interface";
import { IOrderItemRepository } from "@domain/repositories/IOrderItemRepository";
import { injectable } from "tsyringe";
import { Repository } from "typeorm";
import { OrderItemEntity } from "../models/order-item.entity";
import { typeOrmConnection } from "../typeorm-connection";

@injectable()
export class OrderItemEntityRepository implements IOrderItemRepository {
    private readonly orderRepository: Repository<OrderItemEntity>;
    
    constructor() {
        this.orderRepository = typeOrmConnection.getRepository(OrderItemEntity);
    }

    async saveAll(orderItems: IOrderItemToCreate[]): Promise<IOrderItem[]> {
        const orderItemsToSave = orderItems.map(async (item) => {
           return await this.save(item);
        })
        const items = await Promise.all(orderItemsToSave);
        return items;
    }

    async save(orderItem: IOrderItemToCreate): Promise<IOrderItem> {
        const item = await this.orderRepository.save(orderItem);
        return item;
    }
}