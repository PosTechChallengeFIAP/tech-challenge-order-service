import { inject, injectable } from "tsyringe";
import { ICreateOrderUseCase } from "./ICreateOrderUseCase";
import { TCreateOrderUseCaseRequest, TCreateOrderUseCaseResponse } from "./TCreateOrderUseCase";
import { IOrderRepository } from "@domain/repositories/IOrderRepository";
import { IOrder } from "@application/DTOs/order.interface";
import { EOrderStatus } from "@domain/models/order-status.enum";
import { IOrderToCreate } from "@application/DTOs/order-to-create.interface";
import { IOrderItemRepository } from "@domain/repositories/IOrderItemRepository";
import { InternalServerError } from "@infra/http/errors/http-errors/InternalServerError";
import { CreateOrderUseCaseMapper } from "./CreateOrderUseCaseMapper";
import { IOrderItemToCreate } from "@application/DTOs/order-item-to-create.interface";
import { IOrderItem } from "@application/DTOs/order-item.interface";
import { Order } from "@domain/models/order";

@injectable()
export class CreateOrderUseCase implements ICreateOrderUseCase {
    constructor(
        @inject("OrderRepository")
        private readonly orderRepository: IOrderRepository,
        @inject("OrderItemRepository")
        private readonly orderItemRepository: IOrderItemRepository,
    ) {}

    async execute(request: TCreateOrderUseCaseRequest): Promise<TCreateOrderUseCaseResponse> {
        const createdOrder = await this.createOrder(request);
        if(!createdOrder) {
            throw new InternalServerError("Error creating order");
        }

        const createdItems = await this.createOrderItems(request, createdOrder);

        const response = CreateOrderUseCaseMapper.createdItemsToDomain(createdOrder, createdItems);
        return response;
    }

    private async createOrder(request: TCreateOrderUseCaseRequest): Promise<IOrder> {
        const {
            pdvId,
            pdvName,
            clientId
        } = request;

        const orderToCreate: IOrderToCreate = {
            pdvId,
            pdvName,
            clientId,
            status: EOrderStatus.ORDERING
        }

        const createdOrder = await this.orderRepository.save(orderToCreate);
        return createdOrder;
    }

    private async createOrderItems({ items }: TCreateOrderUseCaseRequest, order: IOrder): Promise<IOrderItem[]> {
        const itemsToCreate = CreateOrderUseCaseMapper.requestItemsToRepository(items, order);
        const createdItems = await this.orderItemRepository.saveAll(itemsToCreate);
        return createdItems;
    }
}