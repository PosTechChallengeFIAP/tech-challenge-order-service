import { Order } from './order';
import { EOrderStatus } from './order-status.enum';
import { InvalidStatusChangeError } from './order';
import { makeOrder } from '@test/makeData/order.make';
import { makeOrderItem } from '@test/makeData/order-item.make';

describe('Order Entity', () => {
  it('should create an order instance correctly', () => {
    const order = makeOrder();

    expect(order).toBeInstanceOf(Order);
    expect(order.getStatus()).toBe(EOrderStatus.ORDERING);
    expect(order.getPrice()).toBe(0);
  });

  it('should calculate total price of items', () => {
    const items = [
      makeOrderItem(1, 10),
      makeOrderItem(2, 20),
      makeOrderItem(3, 30),
    ];
    const order = makeOrder(EOrderStatus.ORDERING, items);

    expect(order.getPrice()).toBe(60);
  });

  it('should add an item', () => {
    const order = makeOrder();
    const item = makeOrderItem(1, 15);

    order.addItem(item);

    expect(order.getPrice()).toBe(15);
    expect(order.orderItems).toHaveLength(1);
  });

  it('should remove an item by id', () => {
    const item1 = makeOrderItem(1, 10);
    const item2 = makeOrderItem(2, 20);
    const order = makeOrder(EOrderStatus.ORDERING, [item1, item2]);

    order.removeItem(1);

    expect(order.orderItems).toHaveLength(1);
    expect(order.orderItems[0].id).toBe(2);
    expect(order.getPrice()).toBe(20);
  });

    describe('should change status', () => {
        it('when the old status is ORDERING and newest status is PAYMENT_PENDING', () => {
            const order = makeOrder(EOrderStatus.ORDERING);
            const baseDate = order.updatedAt;
        
            order.setStatus(EOrderStatus.PAYMENT_PENDING);
        
            expect(order.getStatus()).toBe(EOrderStatus.PAYMENT_PENDING);
            expect(order.updatedAt).not.toBe(baseDate);
        });
        it('when the old status is PAYMENT_PENDING and newest status is PAYMENT_CONFIRMED', () => {
            const order = makeOrder(EOrderStatus.PAYMENT_PENDING);
            const baseDate = order.updatedAt;
        
            order.setStatus(EOrderStatus.PAYMENT_CONFIRMED);
        
            expect(order.getStatus()).toBe(EOrderStatus.PAYMENT_CONFIRMED);
            expect(order.updatedAt).not.toBe(baseDate);
        });
        it('when the old status is PAYMENT_CONFIRMED and newest status is QUEUED', () => {
            const order = makeOrder(EOrderStatus.PAYMENT_CONFIRMED);
            const baseDate = order.updatedAt;
        
            order.setStatus(EOrderStatus.QUEUED);
        
            expect(order.getStatus()).toBe(EOrderStatus.QUEUED);
            expect(order.updatedAt).not.toBe(baseDate);
        });
        it('when the old status is QUEUED and newest status is PREPARING', () => {
            const order = makeOrder(EOrderStatus.QUEUED);
            const baseDate = order.updatedAt;
        
            order.setStatus(EOrderStatus.PREPARING);
        
            expect(order.getStatus()).toBe(EOrderStatus.PREPARING);
            expect(order.updatedAt).not.toBe(baseDate);
        });
        it('when the old status is PREPARING and newest status is DONE', () => {
            const order = makeOrder(EOrderStatus.PREPARING);
            const baseDate = order.updatedAt;
        
            order.setStatus(EOrderStatus.DONE);
        
            expect(order.getStatus()).toBe(EOrderStatus.DONE);
            expect(order.updatedAt).not.toBe(baseDate);
        });
        it.each([
            EOrderStatus.ORDERING,
            EOrderStatus.PAYMENT_PENDING,
            EOrderStatus.PAYMENT_CONFIRMED,
            EOrderStatus.QUEUED,
            EOrderStatus.PREPARING,
        ])
        ('when the old status is %s and newest status is CANCELLED', (oldStatus) => {
            const order = makeOrder(oldStatus);
            const baseDate = order.updatedAt;

            order.setStatus(EOrderStatus.CANCELLED);

            expect(order.getStatus()).toBe(EOrderStatus.CANCELLED);
            expect(order.updatedAt).not.toBe(baseDate);
        });
    })
  

  it('should throw error for invalid status transition', () => {
    const order = makeOrder(EOrderStatus.DONE);

    expect(() => {
      order.setStatus(EOrderStatus.CANCELLED);
    }).toThrow(InvalidStatusChangeError);
  });
});
