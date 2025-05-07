import { OrderItem } from "@domain/models/order-item";
import { OrderItemEntity } from "../models/order-item.entity";
import { IOrder } from "@application/DTOs/order.interface";

export class OrderItemEntityMapper {
    static toDomain(orderItemEntity: OrderItemEntity, order: IOrder): OrderItem {
        return new OrderItem(
            orderItemEntity.id,
            order,
            orderItemEntity.productId,
            orderItemEntity.productName,
            orderItemEntity.productPrice,
            orderItemEntity.quantity,
            orderItemEntity.createdAt,
            orderItemEntity.updatedAt
        );
    }

    static mapToDomain(orderItems: OrderItemEntity[], order: IOrder): OrderItem[] {
        return orderItems.map((orderItem) => OrderItemEntityMapper.toDomain(orderItem, order));
    }
}