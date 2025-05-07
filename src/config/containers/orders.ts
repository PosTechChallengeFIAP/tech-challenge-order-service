import { CreateOrderUseCase } from "@application/usecases/orders/create-order/CreateOrderUseCase";
import { ICreateOrderUseCase } from "@application/usecases/orders/create-order/ICreateOrderUseCase";
import { FindAllOrdersUseCase } from "@application/usecases/orders/find-order/find-all-orders/FindAllOrdersUseCase";
import { IFindAllOrdersUseCase } from "@application/usecases/orders/find-order/find-all-orders/IFindAllOrdersUseCase";
import { FindOneOrderUseCase } from "@application/usecases/orders/find-order/find-one-order/FindOneOrderUseCase";
import { IFindOneOrderUseCase } from "@application/usecases/orders/find-order/find-one-order/IFindOneOrderUseCase";
import { IOrderRepository } from "@domain/repositories/IOrderRepository";
import { CreateOrderController } from "@infra/http/controllers/orders/create-order/CreateOrderController";
import { FindAllOrOneOrdersController } from "@infra/http/controllers/orders/find-order/FindOrderController";
import { IController } from "@infra/http/protocols/controller";
import { container } from "tsyringe";

container.registerSingleton<IFindAllOrdersUseCase>("FindAllOrdersUseCase", FindAllOrdersUseCase);
container.registerSingleton<IFindOneOrderUseCase>("FindOneOrderUseCase", FindOneOrderUseCase);
container.registerSingleton<ICreateOrderUseCase>("CreateOrderUseCase", CreateOrderUseCase);

container.registerSingleton<IController>("FindAllOrOneOrdersController", FindAllOrOneOrdersController);
container.registerSingleton<IController>("CreateOrderController", CreateOrderController);