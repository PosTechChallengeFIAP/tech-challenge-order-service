import { IOrder } from "@application/DTOs/order.interface";
import { IOrderRepository } from "@domain/repositories/IOrderRepository";
import { Repository } from "typeorm";
import { OrderEntity } from "../models/order.entity";
import { typeOrmConnection } from "../typeorm-connection";
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

    async findById(id: number): Promise<IOrder | null> {
        const orderFromDB = await this.orderRepository.findOne({ where: { id } });
        if (!orderFromDB) {
            return null;
        }
        const order = OrderEntityMapper.toDomain(orderFromDB);
        return order;
    }
}