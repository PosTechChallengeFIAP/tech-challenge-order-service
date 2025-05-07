import { OrderEntityMapper } from '@infra/persistence/typeorm/mappers/order-entity.mapper';
import { OrderEntity } from '@infra/persistence/typeorm/models/order.entity';
import { OrderItemEntity } from '@infra/persistence/typeorm/models/order-item.entity';
import { OrderItemEntityMapper } from '@infra/persistence/typeorm/mappers/order-item-entity.mapper';
import { EOrderStatus } from '@domain/models/order-status.enum';

jest.mock('@infra/persistence/typeorm/mappers/order-item-entity.mapper', () => ({
  OrderItemEntityMapper: {
    mapToDomain: jest.fn()
  }
}));

describe('OrderEntityMapper', () => {
  const baseOrderEntity: OrderEntity = {
    id: 1,
    pdvId: 10,
    pdvName: 'PDV 1',
    clientId: 123,
    status: EOrderStatus.ORDERING,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-02'),
    orderItems: []
  };

  describe('toDomain', () => {
    it('when orderEntity has orderItems should map with items', () => {
      const itemsMock: OrderItemEntity[] = [
        {
          id: 1,
          order: {} as any,
          productId: 101,
          productName: 'Pizza',
          productPrice: 30,
          quantity: 2,
          totalPrice: 60,
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-02')
        }
      ];

      const entity: OrderEntity = {
        ...baseOrderEntity,
        orderItems: itemsMock
      };

      const mappedItems = ['mockedItem'];
      (OrderItemEntityMapper.mapToDomain as jest.Mock).mockReturnValue(mappedItems);

      const result = OrderEntityMapper.toDomain(entity);

      expect(OrderItemEntityMapper.mapToDomain).toHaveBeenCalledWith(itemsMock, expect.any(Object));
      expect(result).toEqual(expect.objectContaining({
        id: entity.id,
        pdvId: entity.pdvId,
        pdvName: entity.pdvName,
        clientId: entity.clientId,
        status: entity.status,
        orderItems: mappedItems,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt
      }));
    });

    it('when orderEntity has no orderItems should return empty items array', () => {
      const entity: OrderEntity = {
        ...baseOrderEntity,
        orderItems: undefined
      };

      const result = OrderEntityMapper.toDomain(entity);

      expect(result.orderItems).toEqual([]);
      expect(OrderItemEntityMapper.mapToDomain).not.toHaveBeenCalled();
    });
  });

  describe('mapToDomain', () => {
    it('when called with array of OrderEntity should map all', () => {
      const entities = [baseOrderEntity, { ...baseOrderEntity, id: 2 }];

      jest.spyOn(OrderEntityMapper, 'toDomain').mockImplementation((e) => ({ id: e.id } as any));

      const result = OrderEntityMapper.mapToDomain(entities);

      expect(result).toEqual([{ id: 1 }, { id: 2 }]);
      expect(OrderEntityMapper.toDomain).toHaveBeenCalledTimes(2);
    });
  });
});
