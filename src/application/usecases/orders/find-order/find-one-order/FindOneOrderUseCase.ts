import { IOrderRepository } from "@domain/repositories/IOrderRepository";
import { IFindOneOrderUseCase } from "./IFindOneOrderUseCase";
import { inject, injectable } from "tsyringe";
import { TFindOneOrderUseCaseRequest, TFindOneOrderUseCaseResponse } from "./TFindOneOrderUseCase";

@injectable()
export class FindOneOrderUseCase implements IFindOneOrderUseCase {
    constructor(
        @inject("OrderRepository")
        private readonly orderRepository: IOrderRepository
    ) {}

    async execute({ id }: TFindOneOrderUseCaseRequest): Promise<TFindOneOrderUseCaseResponse> {
        const order = await this.orderRepository.findById(id);
        return order;
    }
}