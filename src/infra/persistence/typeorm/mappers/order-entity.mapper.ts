import { IOrder } from "@application/DTOs/order.interface";
import { OrderEntity } from "../models/order.entity";
import { Order } from "@domain/models/order";
import { OrderItem } from "@domain/models/order-item";

export class OrderEntityMapper {
    static toDomain(orderEntity: OrderEntity): IOrder {
        return new Order(
            orderEntity.id,
            orderEntity.paymentId,
            orderEntity.pdvId,
            orderEntity.pdvName,
            orderEntity.clientId,
            orderEntity.status,
            orderEntity.orderItems?.map((item) => {
                return new OrderItem(
                    item.id,
                    orderEntity.id,
                    item.productId,
                    item.productName,
                    item.productPrice,
                    item.quantity,
                    item.createdAt,
                    item.updatedAt
                )
            }),
            orderEntity.createdAt,
            orderEntity.updatedAt
        )
    }

    static mapToDomain(orders: OrderEntity[]): IOrder[] {
        return orders.map((order) => OrderEntityMapper.toDomain(order));
    }
}