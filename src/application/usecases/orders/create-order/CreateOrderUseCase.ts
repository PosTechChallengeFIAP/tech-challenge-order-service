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
import { IInventoryServiceAdapter } from "@infra/adapters/InventoryService/IInventoryServiceAdapter";
import { BadRequest } from "@infra/http/errors/http-errors/BadRequest";
import { TPoc } from "@infra/adapters/InventoryService/TInventoryServiceAdapter";
import { Logger } from "@infra/utils/logger/Logger";

@injectable()
export class CreateOrderUseCase implements ICreateOrderUseCase {
    constructor(
        @inject("OrderRepository")
        private readonly orderRepository: IOrderRepository,
        @inject("OrderItemRepository")
        private readonly orderItemRepository: IOrderItemRepository,
        @inject("InventoryServiceAdapter")
        private readonly inventoryServiceAdapter: IInventoryServiceAdapter,
    ) {}

    async execute(request: TCreateOrderUseCaseRequest): Promise<TCreateOrderUseCaseResponse> {
        const pocFound = await this.inventoryServiceAdapter.getPocById(request.pdvId);
        if (!pocFound) {
            throw new BadRequest("POC not found", request);
        }

        const createdOrder = await this.createOrder(request, pocFound);
        if(!createdOrder) {
            throw new InternalServerError("Error creating order");
        }

        const createdItems = await this.createOrderItems(request, createdOrder);

        const response = CreateOrderUseCaseMapper.createdItemsToDomain(createdOrder, createdItems);
        return response;
    }

    private async createOrder(request: TCreateOrderUseCaseRequest, poc: TPoc): Promise<IOrder> {
        const {
            name
        } = poc;

        const {
            pdvId,
            clientId
        } = request;

        const orderToCreate: IOrderToCreate = {
            pdvId,
            pdvName: name,
            clientId,
            status: EOrderStatus.ORDERING
        }

        Logger.info({ message: `[XXXXXXXXXXXXXXXXXXX] Creating order`, additionalInfo: orderToCreate});

        const createdOrder = await this.orderRepository.save(orderToCreate);
        return createdOrder;
    }

    private async createOrderItems({ items, pdvId }: TCreateOrderUseCaseRequest, order: IOrder): Promise<IOrderItem[]> {
        const itemsToCreate: IOrderItemToCreate[] = [];

        const findProducts = items.map(async (item) => {
            const productFound = await this.inventoryServiceAdapter.getByPocAndProductId(pdvId, item.productId);
            if (!productFound) {
                throw new BadRequest(`Product with id ${item.productId} not found`);
            }
            const orderItemToCreate: IOrderItemToCreate = {
                order,
                productId: productFound.id,
                productName: productFound.product.name,
                productPrice: productFound.unitPrice,
                quantity: item.quantity,
                totalPrice: productFound.unitPrice * item.quantity,
            };

            itemsToCreate.push(orderItemToCreate);
        });

        
        await Promise.all(findProducts);
        const createdItems = await this.orderItemRepository.saveAll(itemsToCreate);
        return createdItems;
    }
}