import { EOrderStatus } from "@domain/models/order-status.enum";

export interface IOrderToCreate {
    pdvId: number;
    pdvName: string;
    clientId?: number;
    status: EOrderStatus;
}