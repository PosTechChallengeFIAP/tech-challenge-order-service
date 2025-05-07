import { OrderItemEntityMapper } from '@infra/persistence/typeorm/mappers/order-item-entity.mapper';
import { OrderItemEntity } from '@infra/persistence/typeorm/models/order-item.entity';
import { IOrder } from '@application/DTOs/order.interface';
import { EOrderStatus } from '@domain/models/order-status.enum';

describe('OrderItemEntityMapper', () => {
  const mockOrder: IOrder = {
    id: 1,
    pdvId: 10,
    pdvName: 'PDV Teste',
    clientId: 999,
    status: EOrderStatus.ORDERING,
    orderItems: [],
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-02')
  };

  const mockItemEntity: OrderItemEntity = {
    id: 100,
    order: {} as any,
    productId: 123,
    productName: 'Produto X',
    productPrice: 15.5,
    quantity: 2,
    totalPrice: 31,
    createdAt: new Date('2023-01-01T10:00:00Z'),
    updatedAt: new Date('2023-01-01T12:00:00Z')
  };

  describe('toDomain', () => {
    it('when given an OrderItemEntity and IOrder should return a domain OrderItem', () => {
      const result = OrderItemEntityMapper.toDomain(mockItemEntity, mockOrder);

      expect(result).toEqual(expect.objectContaining({
        id: mockItemEntity.id,
        order: mockOrder,
        productId: mockItemEntity.productId,
        productName: mockItemEntity.productName,
        productPrice: mockItemEntity.productPrice,
        quantity: mockItemEntity.quantity,
        createdAt: mockItemEntity.createdAt,
        updatedAt: mockItemEntity.updatedAt
      }));
    });
  });

  describe('mapToDomain', () => {
    it('when given a list of OrderItemEntity and IOrder should return a list of domain OrderItems', () => {
      const items = [mockItemEntity, { ...mockItemEntity, id: 101 }];
      const result = OrderItemEntityMapper.mapToDomain(items, mockOrder);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(100);
      expect(result[1].id).toBe(101);
      result.forEach((item: any) => {
        expect(item.order).toBe(mockOrder);
      });
    });

    it('when given an empty array should return an empty array', () => {
      const result = OrderItemEntityMapper.mapToDomain([], mockOrder);
      expect(result).toEqual([]);
    });
  });
});
