import { CreateOrderUseCase } from "./CreateOrderUseCase";
import { EOrderStatus } from "@domain/models/order-status.enum";
import { InternalServerError } from "@infra/http/errors/http-errors/InternalServerError";
import { CreateOrderUseCaseMapper } from "./CreateOrderUseCaseMapper";

const mockOrderRepository = {
  save: jest.fn(),
};

const mockOrderItemRepository = {
  saveAll: jest.fn(),
};

jest.mock("./CreateOrderUseCaseMapper", () => ({
  CreateOrderUseCaseMapper: {
    requestItemsToRepository: jest.fn(),
    createdItemsToDomain: jest.fn(),
  },
}));

const makeRequest = () => ({
  pdvId: 1,
  pdvName: "PDV 1",
  clientId: 123,
  items: [
    {
      productId: 10,
      productName: "Produto Teste",
      productPrice: 25.0,
      quantity: 2,
    },
  ],
});

const makeOrder = () => ({
  id: 1,
  pdvId: 1,
  pdvName: "PDV 1",
  clientId: 123,
  status: EOrderStatus.ORDERING,
  orderItems: [] as any[],
  createdAt: new Date(),
  updatedAt: new Date(),
});

describe("CreateOrderUseCase", () => {
  let useCase: CreateOrderUseCase;

  beforeEach(() => {
    useCase = new CreateOrderUseCase(
      mockOrderRepository as any,
      mockOrderItemRepository as any
    );
    jest.clearAllMocks();
  });

  it("when called with valid request should create order and items and return response", async () => {
    const request = makeRequest();
    const mockCreatedOrder = makeOrder();
    const mockCreatedItems = [{ id: 1, ...request.items[0], order: mockCreatedOrder }];

    mockOrderRepository.save.mockResolvedValueOnce(mockCreatedOrder);
    mockOrderItemRepository.saveAll.mockResolvedValueOnce(mockCreatedItems);
    (CreateOrderUseCaseMapper.requestItemsToRepository as jest.Mock).mockReturnValueOnce(
      request.items
    );
    (CreateOrderUseCaseMapper.createdItemsToDomain as jest.Mock).mockReturnValueOnce({
      ...mockCreatedOrder,
      orderItems: mockCreatedItems,
    });

    const result = await useCase.execute(request);

    expect(result).toEqual({
      ...mockCreatedOrder,
      orderItems: mockCreatedItems,
    });
    expect(mockOrderRepository.save).toHaveBeenCalledWith({
      pdvId: request.pdvId,
      pdvName: request.pdvName,
      clientId: request.clientId,
      status: EOrderStatus.ORDERING,
    });
    expect(CreateOrderUseCaseMapper.requestItemsToRepository).toHaveBeenCalledWith(
      request.items,
      mockCreatedOrder
    );
    expect(mockOrderItemRepository.saveAll).toHaveBeenCalledWith(request.items);
    expect(CreateOrderUseCaseMapper.createdItemsToDomain).toHaveBeenCalledWith(
      mockCreatedOrder,
      mockCreatedItems
    );
  });

  it("when orderRepository.save returns null should throw InternalServerError", async () => {
    const request = makeRequest();
    mockOrderRepository.save.mockResolvedValueOnce(null);

    await expect(useCase.execute(request)).rejects.toThrow(InternalServerError);
    expect(mockOrderRepository.save).toHaveBeenCalled();
    expect(mockOrderItemRepository.saveAll).not.toHaveBeenCalled();
  });

  it("when orderItemRepository.saveAll throws should bubble the error", async () => {
    const request = makeRequest();
    const mockCreatedOrder = makeOrder();

    mockOrderRepository.save.mockResolvedValueOnce(mockCreatedOrder);
    mockOrderItemRepository.saveAll.mockRejectedValueOnce(new Error("Failed"));

    (CreateOrderUseCaseMapper.requestItemsToRepository as jest.Mock).mockReturnValueOnce(
      request.items
    );

    await expect(useCase.execute(request)).rejects.toThrow("Failed");
    expect(mockOrderRepository.save).toHaveBeenCalled();
    expect(mockOrderItemRepository.saveAll).toHaveBeenCalled();
  });

  it("when createdItemsToDomain throws should bubble the error", async () => {
    const request = makeRequest();
    const mockCreatedOrder = makeOrder();
    const mockCreatedItems = [{ id: 1, ...request.items[0], order: mockCreatedOrder }];

    mockOrderRepository.save.mockResolvedValueOnce(mockCreatedOrder);
    mockOrderItemRepository.saveAll.mockResolvedValueOnce(mockCreatedItems);
    (CreateOrderUseCaseMapper.requestItemsToRepository as jest.Mock).mockReturnValueOnce(
      request.items
    );
    (CreateOrderUseCaseMapper.createdItemsToDomain as jest.Mock).mockImplementationOnce(() => {
      throw new Error("Mapping failed");
    });

    await expect(useCase.execute(request)).rejects.toThrow("Mapping failed");
    expect(mockOrderRepository.save).toHaveBeenCalled();
    expect(mockOrderItemRepository.saveAll).toHaveBeenCalled();
    expect(CreateOrderUseCaseMapper.createdItemsToDomain).toHaveBeenCalled();
  });
});
