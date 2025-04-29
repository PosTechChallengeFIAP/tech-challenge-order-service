import { FindOneOrderUseCase } from './FindOneOrderUseCase';
import { IOrderRepository } from '@domain/repositories/IOrderRepository';
import { IOrder } from '@application/DTOs/order.interface';

describe('FindOneOrderUseCase', () => {
  let useCase: FindOneOrderUseCase;
  let orderRepositoryMock: jest.Mocked<IOrderRepository>;

  beforeEach(() => {
    orderRepositoryMock = {
      findById: jest.fn(),
      findAll: jest.fn()
    } as unknown as jest.Mocked<IOrderRepository>;

    useCase = new FindOneOrderUseCase(orderRepositoryMock);
  });

  it('when valid id is provided should return the corresponding order', async () => {
    const fakeOrder: IOrder = { id: 1 } as IOrder;

    orderRepositoryMock.findById.mockResolvedValue(fakeOrder);

    const result = await useCase.execute({ id: 1 });

    expect(orderRepositoryMock.findById).toHaveBeenCalledWith(1);
    expect(result).toBe(fakeOrder);
  });

  it('when order is not found should return undefined', async () => {
    orderRepositoryMock.findById.mockResolvedValue(undefined);

    const result = await useCase.execute({ id: 999 });

    expect(orderRepositoryMock.findById).toHaveBeenCalledWith(999);
    expect(result).toBeUndefined();
  });
});
