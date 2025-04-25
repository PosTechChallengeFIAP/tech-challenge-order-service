import { OrderItem } from '@domain/models/order-item';

describe('OrderItem', () => {
  it('when instance is created should initialize all fields and calculate totalPrice', () => {
    const now = new Date();
    
    const item = new OrderItem(
      1,            // id
      10,           // orderId
      100,          // productId
      'Burger',     // productName
      25.5,         // productPrice
      2,            // quantity
      now,          // createdAt
      now           // updatedAt
    );

    expect(item.id).toBe(1);
    expect(item.orderId).toBe(10);
    expect(item.productId).toBe(100);
    expect(item.productName).toBe('Burger');
    expect(item.productPrice).toBe(25.5);
    expect(item.quantity).toBe(2);
    expect(item.totalPrice).toBe(51); // 25.5 * 2
    expect(item.createdAt).toBe(now);
    expect(item.updatedAt).toBe(now);
  });
});
