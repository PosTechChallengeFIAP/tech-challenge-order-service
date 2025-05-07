import { IOrderItemToCreate } from "@application/DTOs/order-item-to-create.interface";
import { TCreateOrderUseCaseRequest, TCreateOrderUseCaseRequestItems } from "./TCreateOrderUseCase";
import { IOrder } from "@application/DTOs/order.interface";
import { IOrderItem } from "@application/DTOs/order-item.interface";
import { Order } from "@domain/models/order";

export class CreateOrderUseCaseMapper {
    static requestItemsToRepository(data: TCreateOrderUseCaseRequestItems, order: IOrder): IOrderItemToCreate[] {
        return data.map(item => ({
            productId: item.productId,
            productName: item.productName,
            productPrice: item.productPrice,
            quantity: item.quantity,
            totalPrice: item.productPrice * item.quantity,
            order,
        }));
    }

    static createdItemsToDomain(order: IOrder, items: IOrderItem[]): Order {
        const response = new Order(
            order.id,
            order.pdvId,
            order.pdvName,
            order.clientId,
            order.status,
            items,
            order.createdAt,
            order.updatedAt,
        );

        return response;
    }
}