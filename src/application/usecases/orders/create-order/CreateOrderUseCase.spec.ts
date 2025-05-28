
import { IOrderRepository } from "@domain/repositories/IOrderRepository";
import { IOrderItemRepository } from "@domain/repositories/IOrderItemRepository";
import { IInventoryServiceAdapter } from "@infra/adapters/InventoryService/IInventoryServiceAdapter";
import { EOrderStatus } from "@domain/models/order-status.enum";
import { BadRequest } from "@infra/http/errors/http-errors/BadRequest";
import { InternalServerError } from "@infra/http/errors/http-errors/InternalServerError";
import { CreateOrderUseCase } from "./CreateOrderUseCase";
import { IOrder } from "@application/DTOs/order.interface";
import { IOrderItem } from "@application/DTOs/order-item.interface";
import { SQSHandler } from "@infra/aws/sqs/sendMessage";

const makeSut = () => {
  const orderRepository: jest.Mocked<IOrderRepository> = {
    save: jest.fn()
  } as any;

  const orderItemRepository: jest.Mocked<IOrderItemRepository> = {
    saveAll: jest.fn()
  } as any;

  const inventoryServiceAdapter: jest.Mocked<IInventoryServiceAdapter> = {
    getPocById: jest.fn(),
    getByPocAndProductId: jest.fn()
  } as any;

  const sut = new CreateOrderUseCase(
    orderRepository,
    orderItemRepository,
    inventoryServiceAdapter
  );

  return { sut, orderRepository, orderItemRepository, inventoryServiceAdapter };
};

describe("CreateOrderUseCase", () => {
  const request = {
    pdvId: 1,
    clientId: 123,
    items: [
      {
        productId: 10,
        quantity: 2
      }
    ]
  } as any;

  const poc = {
    id: 1,
    name: "PDV Test"
  } as any;

  const product = {
    id: 10,
    unitPrice: 5,
    product: { name: "Product A" }
  } as any;

  const createdItems: IOrderItem[] = [
    {
      order: null,
      productId: 10,
      productName: "Product A",
      productPrice: 5,
      quantity: 2,
      totalPrice: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
      id:1
    }
  ];

  const createdOrder: IOrder = {
    id: 1,
    pdvId: 1,
    clientId: 123,
    pdvName: "PDV Test",
    status: EOrderStatus.ORDERING,
    createdAt: new Date(),
    updatedAt: new Date(),
    orderItems: createdItems
  };

  beforeAll(() => {
    jest.spyOn(SQSHandler, 'sendMessage').mockImplementation(() => Promise.resolve());
  })

  it("when POC exists and products exist should create order and items", async () => {
    const { sut, orderRepository, orderItemRepository, inventoryServiceAdapter } = makeSut();

    inventoryServiceAdapter.getPocById.mockResolvedValue(poc);
    inventoryServiceAdapter.getByPocAndProductId.mockResolvedValue(product);
    orderRepository.save.mockResolvedValue(createdOrder);
    orderItemRepository.saveAll.mockResolvedValue(createdItems);

    const result = await sut.execute(request);

    expect(result).toEqual(createdOrder);
    expect(orderRepository.save).toHaveBeenCalledTimes(1);
    expect(orderItemRepository.saveAll).toHaveBeenCalledTimes(1);
  });

  it("when POC is not found should throw BadRequest", async () => {
    const { sut, inventoryServiceAdapter } = makeSut();
    inventoryServiceAdapter.getPocById.mockResolvedValue(null);

    await expect(sut.execute(request)).rejects.toThrow(BadRequest);
  });

  it("when product is not found should throw BadRequest", async () => {
    const { sut, inventoryServiceAdapter, orderRepository } = makeSut();

    orderRepository.save.mockResolvedValue(createdOrder);
    inventoryServiceAdapter.getPocById.mockResolvedValue(poc);
    inventoryServiceAdapter.getByPocAndProductId.mockResolvedValue(null);

    await expect(sut.execute(request)).rejects.toThrow(BadRequest);
  });

  it("when order creation fails should throw InternalServerError", async () => {
    const { sut, orderRepository, inventoryServiceAdapter } = makeSut();

    inventoryServiceAdapter.getPocById.mockResolvedValue(poc);
    inventoryServiceAdapter.getByPocAndProductId.mockResolvedValue(product);
    orderRepository.save.mockResolvedValue(null);

    await expect(sut.execute(request)).rejects.toThrow(InternalServerError);
  });
});
