
import { EOrderStatus } from '@domain/models/order-status.enum';
import { OrderEntity } from '../models/order.entity';
import { OrderItem } from '@domain/models/order-item';
import { OrderEntityMapper } from './order-entity.mapper';

describe('OrderEntityMapper', () => {
  const mockOrderEntity: OrderEntity = {
    id: 1,
    paymentId: 100,
    pdvId: 200,
    pdvName: 'PDV Test',
    clientId: 999,
    status: EOrderStatus.ORDERING,
    orderItems: [
      {
        id: 1,
        productId: 10,
        productName: 'Product 1',
        productPrice: 50.0,
        quantity: 2,
        totalPrice: 100.0,
        order: {} as any, // Mocking the order reference
        createdAt: new Date('2023-01-01T10:00:00Z'),
        updatedAt: new Date('2023-01-01T10:00:00Z'),
      },
      {
        id: 2,
        productId: 20,
        productName: 'Product 2',
        productPrice: 30.0,
        quantity: 1,
        totalPrice: 100.0,
        order: {} as any, // Mocking the order reference
        createdAt: new Date('2023-01-01T11:00:00Z'),
        updatedAt: new Date('2023-01-01T11:00:00Z'),
      },
    ],
    createdAt: new Date('2023-01-01T09:00:00Z'),
    updatedAt: new Date('2023-01-01T12:00:00Z'),
  };

  it('should map OrderEntity to Order (domain)', () => {
    const domainOrder = OrderEntityMapper.toDomain(mockOrderEntity);

    expect(domainOrder).toBeDefined();
    expect(domainOrder.id).toBe(mockOrderEntity.id);
    expect(domainOrder.paymentId).toBe(mockOrderEntity.paymentId);
    expect(domainOrder.pdvId).toBe(mockOrderEntity.pdvId);
    expect(domainOrder.pdvName).toBe(mockOrderEntity.pdvName);
    expect(domainOrder.clientId).toBe(mockOrderEntity.clientId);
    expect(domainOrder.getStatus()).toBe(mockOrderEntity.status);
    expect(domainOrder.orderItems).toHaveLength(2);
    expect(domainOrder.createdAt).toEqual(mockOrderEntity.createdAt);
    expect(domainOrder.updatedAt).toEqual(mockOrderEntity.updatedAt);

    domainOrder.orderItems.forEach((item, index) => {
      const original = mockOrderEntity.orderItems[index];
      expect(item).toBeInstanceOf(OrderItem);
      expect(item.id).toBe(original.id);
      expect(item.productId).toBe(original.productId);
      expect(item.productName).toBe(original.productName);
      expect(item.productPrice).toBe(original.productPrice);
      expect(item.quantity).toBe(original.quantity);
      expect(item.createdAt).toEqual(original.createdAt);
      expect(item.updatedAt).toEqual(original.updatedAt);
    });
  });

  it('should map array of OrderEntity to array of domain Orders', () => {
    const orderEntities = [mockOrderEntity, { ...mockOrderEntity, id: 2 }];
    const domainOrders = OrderEntityMapper.mapToDomain(orderEntities);

    expect(domainOrders).toHaveLength(2);
    expect(domainOrders[0].id).toBe(1);
    expect(domainOrders[1].id).toBe(2);
  });
});