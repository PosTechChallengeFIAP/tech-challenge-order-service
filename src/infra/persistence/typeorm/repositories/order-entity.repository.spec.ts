import { OrderEntityRepository } from '../repositories/order-entity.repository';
import { typeOrmConnection } from '../typeorm-connection';
import { OrderEntityMapper } from '../mappers/order-entity.mapper';
import { OrderEntity } from '../models/order.entity';
import { Repository } from 'typeorm';
import { IOrder } from '@application/DTOs/order.interface';

jest.mock('../typeorm-connection', () => ({
  typeOrmConnection: {
    getRepository: jest.fn()
  }
}));

jest.mock('../mappers/order-entity.mapper', () => ({
  OrderEntityMapper: {
    mapToDomain: jest.fn(),
    toDomain: jest.fn()
  }
}));

describe('OrderEntityRepository', () => {
  let repository: OrderEntityRepository;
  let mockedRepo: jest.Mocked<Repository<OrderEntity>>;

  beforeEach(() => {
    mockedRepo = {
      find: jest.fn(),
      findOne: jest.fn()
    } as unknown as jest.Mocked<Repository<OrderEntity>>;

    (typeOrmConnection.getRepository as jest.Mock).mockReturnValue(mockedRepo);

    repository = new OrderEntityRepository(); // cobre o constructor
  });

  describe('contructor', () => {
    it('when repository is constructed should initialize typeorm repository instance', () => {
      expect(typeOrmConnection.getRepository).toHaveBeenCalledWith(OrderEntity);
    });
  })

  describe('findAll', () => {
    it('when called should retrieve all orders from database and map them to domain', async () => {
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

  describe('findById', () => {
    it('when order is found should map and return the order', async () => {
      const fakeEntity = { id: 1 } as OrderEntity;
      const mappedOrder = { id: 1, pdvId: 10 } as IOrder;

      mockedRepo.findOne.mockResolvedValue(fakeEntity);
      (OrderEntityMapper.toDomain as jest.Mock).mockReturnValue(mappedOrder);

      const result = await repository.findById(1);

      expect(mockedRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(OrderEntityMapper.toDomain).toHaveBeenCalledWith(fakeEntity);
      expect(result).toEqual(mappedOrder);
    });

    it('when order is not found should return null', async () => {
      mockedRepo.findOne.mockResolvedValue(null);

      const result = await repository.findById(999);

      expect(mockedRepo.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
      expect(OrderEntityMapper.toDomain).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });
});
