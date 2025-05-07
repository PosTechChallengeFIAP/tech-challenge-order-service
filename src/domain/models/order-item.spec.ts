import { OrderItem } from '@domain/models/order-item';
import { IOrder } from '@application/DTOs/order.interface';
import { EOrderStatus } from './order-status.enum';

describe('OrderItem', () => {
  const mockOrder: IOrder = {
    id: 1,
    pdvId: 10,
    pdvName: 'PDV Teste',
    clientId: 999,
    status: EOrderStatus.ORDERING,
    orderItems: [],
    createdAt: new Date('2023-01-01T10:00:00Z'),
    updatedAt: new Date('2023-01-01T12:00:00Z')
  };

  it('when constructed should assign all properties correctly and calculate totalPrice', () => {
    const item = new OrderItem(
      100,
      mockOrder,
      123,
      'Produto Teste',
      20.5,
      3,
      new Date('2023-05-01T08:00:00Z'),
      new Date('2023-05-01T09:00:00Z')
    );

    expect(item.id).toBe(100);
    expect(item.order).toBe(mockOrder);
    expect(item.productId).toBe(123);
    expect(item.productName).toBe('Produto Teste');
    expect(item.productPrice).toBe(20.5);
    expect(item.quantity).toBe(3);
    expect(item.totalPrice).toBe(61.5); // 20.5 * 3
    expect(item.createdAt.toISOString()).toBe('2023-05-01T08:00:00.000Z');
    expect(item.updatedAt.toISOString()).toBe('2023-05-01T09:00:00.000Z');
  });

  it('when quantity is zero should return totalPrice as 0', () => {
    const item = new OrderItem(
      101,
      mockOrder,
      124,
      'Produto Zerado',
      100,
      0,
      new Date(),
      new Date()
    );

    expect(item.totalPrice).toBe(0);
  });

  it('when productPrice is zero should return totalPrice as 0', () => {
    const item = new OrderItem(
      102,
      mockOrder,
      125,
      'Produto Grátis',
      0,
      10,
      new Date(),
      new Date()
    );

    expect(item.totalPrice).toBe(0);
  });
});
