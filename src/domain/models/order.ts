import { IOrder } from "@application/DTOs/order.interface";
import { EOrderStatus } from "./order-status.enum";
import { OrderItem } from "./order-item";
import { IOrderItem } from "@application/DTOs/order-item.interface";

export const InvalidStatusChangeError = new Error("Invalid status change");

export class Order implements IOrder {
    id: number;
    paymentId: number;
    pdvId: number;
    pdvName: string;
    clientId?: number;
    orderItems: IOrderItem[];
    createdAt: Date;
    updatedAt: Date;
    status: EOrderStatus;

    constructor(
        id: number,
        paymentId: number,
        pdvId: number,
        pdvName: string,
        clientId: number | undefined,
        status: EOrderStatus,
        orderItems: OrderItem[],
        createdAt: Date,
        updatedAt: Date
    ) {
        this.id = id;
        this.paymentId = paymentId;
        this.pdvId = pdvId;
        this.pdvName = pdvName;
        this.clientId = clientId;
        this.status = status;
        this.orderItems = orderItems;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    getPrice(): number {
        return this.orderItems.reduce((total, item) => total + item.totalPrice, 0);
    }

    addItem(item: OrderItem): void {
        this.orderItems.push(item);
    }

    removeItem(itemId: number): void {
        this.orderItems = this.orderItems.filter(item => item.id !== itemId);
    }

    setStatus(status: EOrderStatus): void {
        const isValidChange = this.statusHandler(this.status, status);
        if (!isValidChange) {
            throw InvalidStatusChangeError;
        }
        this.status = status;
        this.updatedAt = new Date();
    }

    getStatus(): EOrderStatus {
        return this.status;
    }

    private statusHandler(oldStatus: EOrderStatus, newStatus: EOrderStatus): boolean {
        type TAvailableStatusChange = {
            [key in EOrderStatus]: EOrderStatus[]
        }
        const availableStatusChange: TAvailableStatusChange = {
            [EOrderStatus.ORDERING]: [
                EOrderStatus.PAYMENT_PENDING,
                EOrderStatus.CANCELLED,
            ],
            [EOrderStatus.PAYMENT_PENDING]: [
                EOrderStatus.PAYMENT_CONFIRMED,
                EOrderStatus.CANCELLED,
            ],
            [EOrderStatus.PAYMENT_CONFIRMED]: [
                EOrderStatus.QUEUED,
                EOrderStatus.CANCELLED,
            ],
            [EOrderStatus.QUEUED]: [
                EOrderStatus.PREPARING,
                EOrderStatus.CANCELLED,
            ],
            [EOrderStatus.PREPARING]: [
                EOrderStatus.DONE,
                EOrderStatus.CANCELLED,
            ],
            [EOrderStatus.CANCELLED]: [],
            [EOrderStatus.DONE]: [],
        }

        return availableStatusChange[oldStatus].includes(newStatus)
    } 
}