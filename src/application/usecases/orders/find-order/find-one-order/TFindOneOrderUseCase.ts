import { IOrder } from "@application/DTOs/order.interface"

export type TFindOneOrderUseCaseRequest = {
    id: number
}

export type TFindOneOrderUseCaseResponse = IOrder | null