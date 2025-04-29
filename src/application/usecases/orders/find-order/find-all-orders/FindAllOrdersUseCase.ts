import { inject, injectable } from "tsyringe";
import { IFindAllOrdersUseCase } from "./IFindAllOrdersUseCase";
import { IOrderRepository } from "@domain/repositories/IOrderRepository";
import { TFindAllOrdersUseCaseRequest, TFindAllOrdersUseCaseResponse } from "./TFindAllOrdersUseCase";

@injectable()
export class FindAllOrdersUseCase implements IFindAllOrdersUseCase {
    constructor(
        @inject("OrderRepository")
        private readonly orderRepository: IOrderRepository
    ) {}
    
    async execute(_: TFindAllOrdersUseCaseRequest): Promise<TFindAllOrdersUseCaseResponse> {
        const orders = await this.orderRepository.findAll();
        return orders;
    }
}