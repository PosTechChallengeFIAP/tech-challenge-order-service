
import { Repository } from 'typeorm';
import { OrderEntityRepository } from './order-entity.repository';
import { OrderEntity } from '../models/order.entity';
import { typeOrmConnection } from '../typeorm-connection';
import { OrderEntityMapper } from '../mappers/order-entity.mapper';

jest.mock('@infra/persistence/typeorm/typeorm-connection', () => ({
  typeOrmConnection: {
    getRepository: jest.fn()
  }
}));

jest.mock('@infra/persistence/typeorm/mappers/order-entity.mapper', () => ({
  OrderEntityMapper: {
    mapToDomain: jest.fn(),
    toDomain: jest.fn()
  }
}));

describe('OrderEntityRepository', () => {
  let repository: OrderEntityRepository;
  let mockRepo: jest.Mocked<Repository<OrderEntity>>;

  beforeEach(() => {
    mockRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn()
    } as unknown as jest.Mocked<Repository<OrderEntity>>;

    (typeOrmConnection.getRepository as jest.Mock).mockReturnValue(mockRepo);
    repository = new OrderEntityRepository();
  });

  it('findAll should return mapped orders from DB', async () => {
    const fakeOrdersFromDB: any = [{ id: 1 }];
    const fakeMappedOrders = [{ id: 1, mapped: true }];

    mockRepo.find.mockResolvedValue(fakeOrdersFromDB);
    (OrderEntityMapper.mapToDomain as jest.Mock).mockReturnValue(fakeMappedOrders);

    const result = await repository.findAll();

    expect(mockRepo.find).toHaveBeenCalledWith({ relations: ['orderItems'] });
    expect(OrderEntityMapper.mapToDomain).toHaveBeenCalledWith(fakeOrdersFromDB);
    expect(result).toEqual(fakeMappedOrders);
  });

  it('findById should return mapped order when found', async () => {
    const fakeOrderFromDB: any = { id: 1 };
    const fakeMappedOrder = { id: 1, mapped: true };

    mockRepo.findOne.mockResolvedValue(fakeOrderFromDB);
    (OrderEntityMapper.toDomain as jest.Mock).mockReturnValue(fakeMappedOrder);

    const result = await repository.findById(1);

    expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['orderItems'] });
    expect(OrderEntityMapper.toDomain).toHaveBeenCalledWith(fakeOrderFromDB);
    expect(result).toEqual(fakeMappedOrder);
  });

  it('findById should return null when not found', async () => {
    mockRepo.findOne.mockResolvedValue(null);

    const result = await repository.findById(999);

    expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: 999 }, relations: ['orderItems'] });
    expect(OrderEntityMapper.toDomain).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it('save should persist order and return mapped result', async () => {
    const orderToSave: any = { clientId: 1 };
    const savedOrder: any = { id: 1 };
    const mappedOrder = { id: 1, mapped: true };

    mockRepo.save.mockResolvedValue(savedOrder);
    (OrderEntityMapper.toDomain as jest.Mock).mockReturnValue(mappedOrder);

    const result = await repository.save(orderToSave);

    expect(mockRepo.save).toHaveBeenCalledWith(orderToSave);
    expect(OrderEntityMapper.toDomain).toHaveBeenCalledWith(savedOrder);
    expect(result).toEqual(mappedOrder);
  });

  it('update should persist partial order and return mapped result', async () => {
    const orderToUpdate: any = { id: 1, status: 'UPDATED' };
    const updatedOrder: any = { id: 1, status: 'UPDATED' };
    const mappedOrder = { id: 1, mapped: true };

    mockRepo.save.mockResolvedValue(updatedOrder);
    (OrderEntityMapper.toDomain as jest.Mock).mockReturnValue(mappedOrder);

    const result = await repository.update(orderToUpdate);

    expect(mockRepo.save).toHaveBeenCalledWith(orderToUpdate);
    expect(OrderEntityMapper.toDomain).toHaveBeenCalledWith(updatedOrder);
    expect(result).toEqual(mappedOrder);
  });
});
