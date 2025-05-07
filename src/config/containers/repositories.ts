import { IOrderItemRepository } from "@domain/repositories/IOrderItemRepository";
import { IOrderRepository } from "@domain/repositories/IOrderRepository";
import { OrderEntityRepository } from "@infra/persistence/typeorm/repositories/order-entity.repository";
import { OrderItemEntityRepository } from "@infra/persistence/typeorm/repositories/order-item-entity.repository";
import { container } from "tsyringe";

container.registerSingleton<IOrderRepository>('OrderRepository', OrderEntityRepository);
container.registerSingleton<IOrderItemRepository>('OrderItemRepository', OrderItemEntityRepository);