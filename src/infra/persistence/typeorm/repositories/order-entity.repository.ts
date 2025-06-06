import { IOrder } from "@application/DTOs/order.interface";
import { IOrderRepository } from "@domain/repositories/IOrderRepository";
import { Repository } from "typeorm";
import { OrderEntity } from "../models/order.entity";
import { typeOrmConnection } from "../typeorm-connection";
import { IOrderToCreate } from "@application/DTOs/order-to-create.interface";
import { injectable } from "tsyringe";

@injectable()
export class OrderEntityRepository implements IOrderRepository {
    private readonly orderRepository: Repository<OrderEntity>;

    constructor() {
        this.orderRepository = typeOrmConnection.getRepository(OrderEntity);
    }

    async findAll(): Promise<IOrder[]> {
        const ordersFromDB = await this.orderRepository.find({ relations: ['orderItems']});
        return ordersFromDB;
    }

    async findById(id: number): Promise<IOrder | null> {
        const orderFromDB = await this.orderRepository.findOne({ where: { id }, relations: ['orderItems'] });
        if (!orderFromDB) {
            return null;
        }
        return orderFromDB;
    }

    async save(orderToSave: IOrderToCreate): Promise<IOrder> {
        const savedOrder = await this.orderRepository.save(orderToSave);
        return savedOrder;
    }

    async update(orderToUpdate: Partial<IOrder>): Promise<IOrder> {
        const updatedOrder = await this.orderRepository.save(orderToUpdate);
        return updatedOrder;
    }
}