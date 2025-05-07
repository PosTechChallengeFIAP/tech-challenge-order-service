import { IOrder } from "@application/DTOs/order.interface";
import { OrderEntity } from "../models/order.entity";
import { Order } from "@domain/models/order";
import { OrderItem } from "@domain/models/order-item";
import { OrderItemEntityMapper } from "./order-item-entity.mapper";

export class OrderEntityMapper {
    static toDomain(orderEntity: OrderEntity): IOrder {
        const order = new Order(
            orderEntity.id,
            orderEntity.pdvId,
            orderEntity.pdvName,
            orderEntity.clientId,
            orderEntity.status,
            [],
            orderEntity.createdAt,
            orderEntity.updatedAt
        )
        order.orderItems = orderEntity.orderItems ? OrderItemEntityMapper.mapToDomain(orderEntity.orderItems, order) : [];
        return order;
    }

    static mapToDomain(orders: OrderEntity[]): IOrder[] {
        return orders.map((order) => OrderEntityMapper.toDomain(order));
    }
}