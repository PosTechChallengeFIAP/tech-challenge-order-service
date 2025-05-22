import { IOrderRepository } from "@domain/repositories/IOrderRepository";
import { inject, injectable } from "tsyringe";
import { TUpdateOrderStatusUseCaseRequest, TUpdateOrderStatusUseCaseResponse } from "./TUpdateOrderStatus";

@injectable()
export class UpdateOrderStatusUseCase {
    constructor(
        @inject("OrderRepository")
        private readonly orderRepository: IOrderRepository,
    ) {}

    async execute(request: TUpdateOrderStatusUseCaseRequest): Promise<TUpdateOrderStatusUseCaseResponse> {
        const {
            orderId,
            status
        } = request;
        
        const order = await this.orderRepository.findById(orderId);
        if (!order) {
            throw new Error("Order not found");
        }

        order.status = status;
        const updatedOrder = await this.orderRepository.update(order);
        if(!updatedOrder) {
            throw new Error("Error updating order status");
        }

        return updatedOrder;
    }
}