import { IOrder } from "@application/DTOs/order.interface"

export type TCreateOrderUseCaseRequestItems = {
    productId: number;
    productName: string;
    productPrice: number;
    quantity: number;
}[]

export type TCreateOrderUseCaseRequest = {
    pdvId: number;
    clientId?: number;
    items: TCreateOrderUseCaseRequestItems;
}

export type TCreateOrderUseCaseResponse = IOrder