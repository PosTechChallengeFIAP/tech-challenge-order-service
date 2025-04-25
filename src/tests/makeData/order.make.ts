import { IOrder } from "@application/DTOs/order.interface";
import { IOrderItem } from "@application/DTOs/order-item.interface";
import { EOrderStatus } from "@domain/models/order-status.enum";
import { Order } from "@domain/models/order";
import { makeDate } from "./date.make";

export const makeOrder = (status = EOrderStatus.ORDERING, items: IOrderItem[] = []): IOrder =>
    new Order(
      1,
      10,
      100,
      'PDV 1',
      999,
      status,
      items,
      makeDate("2023-10-01T00:00:00Z"),
      makeDate("2023-10-01T00:00:00Z")
    );