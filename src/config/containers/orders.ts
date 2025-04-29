import { FindAllOrdersUseCase } from "@application/usecases/orders/find-order/find-all-orders/FindAllOrdersUseCase";
import { IFindAllOrdersUseCase } from "@application/usecases/orders/find-order/find-all-orders/IFindAllOrdersUseCase";
import { IOrderRepository } from "@domain/repositories/IOrderRepository";
import { FindAllOrOneOrdersController } from "@infra/http/controllers/orders/find-order/FindOrderController";
import { IController } from "@infra/http/protocols/controller";
import { container } from "tsyringe";

container.registerSingleton<IFindAllOrdersUseCase>("FindAllOrdersUseCase", FindAllOrdersUseCase);
container.registerSingleton<IController>("FindAllOrOneOrdersController", FindAllOrOneOrdersController);