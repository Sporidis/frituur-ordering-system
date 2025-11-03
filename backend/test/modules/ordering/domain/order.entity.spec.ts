import { OrderEntity } from '@modules/ordering/domain/order.entity';
import { OrderStatus } from '@modules/ordering/domain/order.types';

describe('OrderEntity', () => {
  it('should calculate total from items', () => {
    const items = [
      { id: '1', name: 'Fries', price: 3, quantity: 2 },
      { id: '2', name: 'Burger', price: 4.5, quantity: 1 },
    ];
    const total = OrderEntity.calculateTotal(items as any);
    expect(total).toBe(10.5);
  });

  it('should estimate ready time based on item count', () => {
    const from = new Date('2024-01-01T10:00:00Z');
    const readyTime = OrderEntity.estimateReadyTime(from, 2);
    const expected = new Date(from.getTime() + (5 + 2 * 2) * 60000);
    expect(readyTime.getTime()).toBe(expected.getTime());
  });

  it('should create order with calculated total when not provided', () => {
    const order = new OrderEntity({
      id: 'o1',
      customerName: 'John',
      items: [{ name: 'Fries', price: 3, quantity: 2 }],
    });
    expect(order.totalAmount).toBe(6);
    expect(order.status).toBe(OrderStatus.PENDING);
  });

  it('should update status and adjust ready time', () => {
    const order = new OrderEntity({
      id: 'o1',
      customerName: 'John',
      items: [{ name: 'Fries', price: 3, quantity: 1 }],
    });
    order.updateStatus(OrderStatus.IN_PROGRESS);
    expect(order.status).toBe(OrderStatus.IN_PROGRESS);
    expect(order.estimatedReadyTime.getTime()).toBeGreaterThan(Date.now());

    order.updateStatus(OrderStatus.READY);
    expect(order.status).toBe(OrderStatus.READY);
    expect(order.estimatedReadyTime.getTime()).toBeLessThanOrEqual(Date.now());
  });
});
