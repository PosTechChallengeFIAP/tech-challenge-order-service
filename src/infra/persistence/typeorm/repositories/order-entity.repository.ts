import { IOrder } from "@application/DTOs/order.interface";
import { IOrderRepository } from "@domain/repositories/IOrderRepository";
import { Repository } from "typeorm";
import { OrderEntity } from "../models/order.entity";
import { typeOrmConnection } from "../typeorm-conection";
import { OrderEntityMapper } from "../mappers/order-entity.mapper";

export class OrderEntityRepository implements IOrderRepository {
    private readonly orderRepository: Repository<OrderEntity>;

    constructor() {
        this.orderRepository = typeOrmConnection.getRepository(OrderEntity);
    }

    async findAll(): Promise<IOrder[]> {
        const ordersFromDB = await this.orderRepository.find({});
        const orders = OrderEntityMapper.mapToDomain(ordersFromDB);
        return orders;
    }
}