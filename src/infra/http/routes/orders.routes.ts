import { Router } from "express"
import { RouterAdapter } from "../adapters/RouterAdapter"
import { container } from "tsyringe"
import { IController } from "../protocols/controller"

const findAllOrOneOrdersController = container.resolve<IController>('FindAllOrOneOrdersController')
const createOrderController = container.resolve<IController>('CreateOrderController')
const updateOrderController = container.resolve<IController>('UpdateOrderController')

export default (route: Router): void => {
    route.get('/orders', RouterAdapter.adapt(findAllOrOneOrdersController))
    route.post('/orders', RouterAdapter.adapt(createOrderController))
    route.put('/orders/:orderId/status', RouterAdapter.adapt(updateOrderController))
}