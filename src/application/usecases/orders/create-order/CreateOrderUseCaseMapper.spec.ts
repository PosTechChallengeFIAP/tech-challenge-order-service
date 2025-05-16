
import { EOrderStatus } from "@domain/models/order-status.enum";
import { Order } from "@domain/models/order";
import { IOrder } from "@application/DTOs/order.interface";
import { IOrderItem } from "@application/DTOs/order-item.interface";
import { CreateOrderUseCaseMapper } from "./CreateOrderUseCaseMapper";

describe("CreateOrderUseCaseMapper", () => {
  const order: IOrder = {
    id: 1,
    pdvId: 1,
    pdvName: "PDV Test",
    clientId: 123,
    status: EOrderStatus.ORDERING,
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-02T00:00:00Z"),
    orderItems: []
  };

  const requestItems = [
    {
      productId: 10,
      productName: "Product A",
      productPrice: 5,
      quantity: 2
    },
    {
      productId: 20,
      productName: "Product B",
      productPrice: 3,
      quantity: 1
    }
  ];

  const createdItems: IOrderItem[] = [
    {
        id: 1,
        order,
        productId: 10,
        productName: "Product A",
        productPrice: 5,
        quantity: 2,
        totalPrice: 10,
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-02T00:00:00Z")
    },
    {
        id: 2,
        order,
        productId: 20,
        productName: "Product B",
        productPrice: 3,
        quantity: 1,
        totalPrice: 3,
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-02T00:00:00Z")
    }
  ];

  it("when mapping request items to repository format should return correct structure", () => {
    const result = CreateOrderUseCaseMapper.requestItemsToRepository(requestItems, order);
    const expectedResult = [
        {
            productId: 10,
            productName: "Product A",
            productPrice: 5,
            quantity: 2,
            totalPrice: 10,
            order,
        },
        {
            productId: 20,
            productName: "Product B",
            productPrice: 3,
            quantity: 1,
            totalPrice: 3,
            order,
        }
    ]
    expect(result).toEqual(expectedResult);
  });

  it("when mapping created order and items to domain should return Order domain entity", () => {
    const result = CreateOrderUseCaseMapper.createdItemsToDomain(order, createdItems);

    expect(result).toBeInstanceOf(Order);
    expect(result.id).toBe(order.id);
    expect(result.orderItems).toEqual(createdItems);
    expect(result.status).toBe(EOrderStatus.ORDERING);
    expect(result.createdAt).toEqual(order.createdAt);
    expect(result.updatedAt).toEqual(order.updatedAt);
  });
});
