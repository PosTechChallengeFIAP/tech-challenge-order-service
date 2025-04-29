import { OrderEntityMapper } from './order-entity.mapper';
import { OrderEntity } from '../models/order.entity';
import { OrderItem } from '@domain/models/order-item';
import { Order } from '@domain/models/order';

jest.mock('@domain/models/order');
jest.mock('@domain/models/order-item');

describe('OrderEntityMapper', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('toDomain', () => {
    it('when orderEntity has orderItems should map to Order domain model correctly', () => {
      const fakeOrderEntity = {
        id: 1,
        paymentId: 100,
        pdvId: 10,
        pdvName: 'PDV Test',
        clientId: 123,
        status: 'ORDERING',
        orderItems: [
          {
            id: 1,
            productId: 101,
            productName: 'Product 1',
            productPrice: 9.99,
            quantity: 2,
            createdAt: new Date('2023-01-01T00:00:00Z'),
            updatedAt: new Date('2023-01-02T00:00:00Z')
          }
        ],
        createdAt: new Date('2023-01-01T00:00:00Z'),
        updatedAt: new Date('2023-01-02T00:00:00Z')
      } as unknown as OrderEntity;

      const result = OrderEntityMapper.toDomain(fakeOrderEntity);

      expect(Order).toHaveBeenCalledWith(
        fakeOrderEntity.id,
        fakeOrderEntity.paymentId,
        fakeOrderEntity.pdvId,
        fakeOrderEntity.pdvName,
        fakeOrderEntity.clientId,
        fakeOrderEntity.status,
        expect.any(Array),
        fakeOrderEntity.createdAt,
        fakeOrderEntity.updatedAt
      );

      expect(OrderItem).toHaveBeenCalledWith(
        fakeOrderEntity.orderItems[0].id,
        fakeOrderEntity.id,
        fakeOrderEntity.orderItems[0].productId,
        fakeOrderEntity.orderItems[0].productName,
        fakeOrderEntity.orderItems[0].productPrice,
        fakeOrderEntity.orderItems[0].quantity,
        fakeOrderEntity.orderItems[0].createdAt,
        fakeOrderEntity.orderItems[0].updatedAt
      );

      expect(result).toBeInstanceOf(Order);
    });

    it('when orderEntity has no orderItems should still create an Order with empty items', () => {
      const fakeOrderEntity = {
        id: 2,
        paymentId: 200,
        pdvId: 20,
        pdvName: 'PDV Empty',
        clientId: 456,
        status: 'ORDERING',
        orderItems: undefined,
        createdAt: new Date('2023-02-01T00:00:00Z'),
        updatedAt: new Date('2023-02-02T00:00:00Z')
      } as unknown as OrderEntity;

      const result = OrderEntityMapper.toDomain(fakeOrderEntity);

      expect(Order).toHaveBeenCalledWith(
        fakeOrderEntity.id,
        fakeOrderEntity.paymentId,
        fakeOrderEntity.pdvId,
        fakeOrderEntity.pdvName,
        fakeOrderEntity.clientId,
        fakeOrderEntity.status,
        undefined,
        fakeOrderEntity.createdAt,
        fakeOrderEntity.updatedAt
      );

      expect(result).toBeInstanceOf(Order);
    });
  });

  describe('mapToDomain', () => {
    it('when list of OrderEntity is provided should map each entity to domain Order', () => {
      const fakeOrderEntities = [
        { id: 1 } as unknown as OrderEntity,
        { id: 2 } as unknown as OrderEntity
      ];

      jest.spyOn(OrderEntityMapper, 'toDomain').mockImplementation((entity) => entity as unknown as Order);

      const result = OrderEntityMapper.mapToDomain(fakeOrderEntities);

      expect(OrderEntityMapper.toDomain).toHaveBeenCalledTimes(2);
      expect(OrderEntityMapper.toDomain).toHaveBeenCalledWith(fakeOrderEntities[0]);
      expect(OrderEntityMapper.toDomain).toHaveBeenCalledWith(fakeOrderEntities[1]);
      expect(result).toEqual(fakeOrderEntities);
    });
  });
});
