import { IOrder } from '@application/DTOs/order.interface';
import { FindAllOrdersUseCase } from './FindAllOrdersUseCase';
import { IOrderRepository } from '@domain/repositories/IOrderRepository';

describe('FindAllOrdersUseCase', () => {
  let mockOrderRepository: jest.Mocked<IOrderRepository>;
  let useCase: FindAllOrdersUseCase;

  beforeEach(() => {
    mockOrderRepository = {
      findAll: jest.fn(),
    } as jest.Mocked<IOrderRepository>;

    useCase = new FindAllOrdersUseCase(mockOrderRepository);
  });

  it('when usecase is executed should return all orders from repository', async () => {
    const fakeOrders = [
      { id: 1, pdvId: 10 },
      { id: 2, pdvId: 11 },
    ] as IOrder[];

    mockOrderRepository.findAll.mockResolvedValue(fakeOrders);

    const result = await useCase.execute();

    expect(mockOrderRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(fakeOrders);
  });
});
