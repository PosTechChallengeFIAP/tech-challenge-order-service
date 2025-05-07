import { Router } from "express"
import { RouterAdapter } from "../adapters/RouterAdapter"
import { container } from "tsyringe"
import { IController } from "../protocols/controller"

const findAllOrOneOrdersController = container.resolve<IController>('FindAllOrOneOrdersController')
const createOrderController = container.resolve<IController>('CreateOrderController')

export default (route: Router): void => {
    route.get('/orders', RouterAdapter.adapt(findAllOrOneOrdersController))
    route.post('/orders', RouterAdapter.adapt(createOrderController))
}