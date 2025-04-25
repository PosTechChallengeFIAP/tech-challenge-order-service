import { OrderEntityRepository } from '../repositories/order-entity.repository';
import { typeOrmConnection } from '../typeorm-connection';
import { OrderEntityMapper } from '../mappers/order-entity.mapper';
import { OrderEntity } from '../models/order.entity';
import { Repository } from 'typeorm';
import { IOrder } from '@application/DTOs/order.interface';

// Mock TypeORM Connection
jest.mock('../typeorm-conection', () => ({
  typeOrmConnection: {
    getRepository: jest.fn()
  }
}));

// Mock do Mapper
jest.mock('../mappers/order-entity.mapper', () => ({
  OrderEntityMapper: {
    mapToDomain: jest.fn()
  }
}));

describe('OrderEntityRepository', () => {
  let repository: OrderEntityRepository;
  let mockedRepo: jest.Mocked<Repository<OrderEntity>>;

  beforeEach(() => {
    mockedRepo = {
      find: jest.fn()
    } as unknown as jest.Mocked<Repository<OrderEntity>>;

    (typeOrmConnection.getRepository as jest.Mock).mockReturnValue(mockedRepo);
    repository = new OrderEntityRepository();
  });

  it('when repository is constructed should initialize typeorm repository instance', () => {
    expect(typeOrmConnection.getRepository).toHaveBeenCalledWith(OrderEntity);
  });

  it('when findAll is called should retrieve all orders from database and map them to domain', async () => {
    const fakeEntities = [{ id: 1 }] as unknown as OrderEntity[];
    const mappedOrders = [{ id: 1, pdvId: 10 }] as unknown as IOrder[];

    mockedRepo.find.mockResolvedValue(fakeEntities);
    (OrderEntityMapper.mapToDomain as jest.Mock).mockReturnValue(mappedOrders);

    const result = await repository.findAll();

    expect(mockedRepo.find).toHaveBeenCalledWith({});
    expect(OrderEntityMapper.mapToDomain).toHaveBeenCalledWith(fakeEntities);
    expect(result).toEqual(mappedOrders);
  });
});
