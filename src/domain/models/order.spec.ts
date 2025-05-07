import { Order } from '@domain/models/order';
import { EOrderStatus } from '@domain/models/order-status.enum';
import { IOrderItem } from '@application/DTOs/order-item.interface';
import { InvalidStatusChangeError } from '@domain/models/order';

describe('Order', () => {
  const now = new Date();
  const orderItemsMock: IOrderItem[] = [
    { id: 1, order: {} as any, productId: 1, productName: 'Item A', productPrice: 10, quantity: 2, totalPrice: 20, createdAt: now, updatedAt: now },
    { id: 2, order: {} as any, productId: 2, productName: 'Item B', productPrice: 5, quantity: 1, totalPrice: 5, createdAt: now, updatedAt: now },
  ];

  function createOrder(status = EOrderStatus.ORDERING): Order {
    return new Order(1, 1, 'PDV Teste', 10, status, [...orderItemsMock], now, now);
  }

  it('when created should initialize all properties correctly', () => {
    const order = createOrder();
    expect(order.id).toBe(1);
    expect(order.pdvId).toBe(1);
    expect(order.pdvName).toBe('PDV Teste');
    expect(order.clientId).toBe(10);
    expect(order.status).toBe(EOrderStatus.ORDERING);
    expect(order.orderItems.length).toBe(2);
    expect(order.createdAt).toBe(now);
    expect(order.updatedAt).toBe(now);
  });

  it('when getPrice is called should return total price of all order items', () => {
    const order = createOrder();
    expect(order.getPrice()).toBe(25); // 20 + 5
  });

  it('when addItem is called should add item to orderItems', () => {
    const order = createOrder();
    const newItem: IOrderItem = {
      id: 3, order: {} as any, productId: 3, productName: 'Item C', productPrice: 7, quantity: 1, totalPrice: 7, createdAt: now, updatedAt: now
    };
    order.addItem(newItem);
    expect(order.orderItems.length).toBe(3);
    expect(order.orderItems).toContain(newItem);
  });

  it('when removeItem is called with existing item id should remove item', () => {
    const order = createOrder();
    order.removeItem(1);
    expect(order.orderItems.length).toBe(1);
    expect(order.orderItems[0].id).toBe(2);
  });

  it('when removeItem is called with non-existing id should keep all items', () => {
    const order = createOrder();
    order.removeItem(999);
    expect(order.orderItems.length).toBe(2);
  });

  it('when getStatus is called should return current status', () => {
    const order = createOrder(EOrderStatus.PREPARING);
    expect(order.getStatus()).toBe(EOrderStatus.PREPARING);
  });

  it('when setStatus is called with valid transition should update status and updatedAt', () => {
    const order = createOrder(EOrderStatus.ORDERING);
    order.setStatus(EOrderStatus.PAYMENT_PENDING);
    expect(order.status).toBe(EOrderStatus.PAYMENT_PENDING);
    expect(order.updatedAt.getTime()).toBeGreaterThanOrEqual(now.getTime());
  });

  it('when setStatus is called with invalid transition should throw InvalidStatusChangeError', () => {
    const order = createOrder(EOrderStatus.ORDERING);
    expect(() => order.setStatus(EOrderStatus.PREPARING)).toThrow(InvalidStatusChangeError);
    expect(order.status).toBe(EOrderStatus.ORDERING);
  });

  it('when status is DONE should not allow any change', () => {
    const order = createOrder(EOrderStatus.DONE);
    expect(() => order.setStatus(EOrderStatus.CANCELLED)).toThrow(InvalidStatusChangeError);
  });

  it('when status is CANCELLED should not allow any change', () => {
    const order = createOrder(EOrderStatus.CANCELLED);
    expect(() => order.setStatus(EOrderStatus.DONE)).toThrow(InvalidStatusChangeError);
  });
});
