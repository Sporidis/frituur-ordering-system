import { OrderService } from '@modules/ordering/order.service';
import { OrderStatus } from '@modules/ordering/domain/order.types';

describe('OrderService', () => {
  let service: OrderService;

  beforeEach(() => {
    service = new OrderService();
  });

  it('should create order with sequential IDs', () => {
    const order1 = service.createOrder('John', [
      { name: 'Fries', price: 3, quantity: 1 },
    ]);
    const order2 = service.createOrder('Jane', [
      { name: 'Burger', price: 5, quantity: 1 },
    ]);

    expect(order1.id).toBe('#001');
    expect(order2.id).toBe('#002');
    expect(order1.customerName).toBe('John');
    expect(order2.customerName).toBe('Jane');
  });

  it('should create order with provided totalAmount', () => {
    const order = service.createOrder(
      'John',
      [{ name: 'Fries', price: 3, quantity: 1 }],
      10.5,
    );
    expect(order.totalAmount).toBe(10.5);
  });

  it('should update order status when order exists', () => {
    const order = service.createOrder('John', [
      { name: 'Fries', price: 3, quantity: 1 },
    ]);
    const result = service.updateOrderStatus(order.id, OrderStatus.IN_PROGRESS);

    expect(result).toBe(true);
    const updated = service.getOrder(order.id);
    expect(updated?.status).toBe(OrderStatus.IN_PROGRESS);
  });

  it('should return false when updating non-existent order', () => {
    const result = service.updateOrderStatus('invalid', OrderStatus.READY);
    expect(result).toBe(false);
  });

  it('should get order by id', () => {
    const created = service.createOrder('John', [
      { name: 'Fries', price: 3, quantity: 1 },
    ]);
    const retrieved = service.getOrder(created.id);

    expect(retrieved).toBeDefined();
    expect(retrieved?.id).toBe(created.id);
  });

  it('should return undefined for non-existent order', () => {
    const order = service.getOrder('invalid');
    expect(order).toBeUndefined();
  });

  it('should get all orders', () => {
    service.createOrder('John', [{ name: 'Fries', price: 3, quantity: 1 }]);
    service.createOrder('Jane', [{ name: 'Burger', price: 5, quantity: 1 }]);

    const all = service.getAllOrders();
    expect(all.length).toBe(2);
  });

  it('should get order stats', () => {
    service.createOrder('John', [{ name: 'Fries', price: 3, quantity: 1 }]);
    const order = service.createOrder('Jane', [
      { name: 'Burger', price: 5, quantity: 1 },
    ]);
    service.updateOrderStatus(order.id, OrderStatus.READY);

    const stats = service.getOrderStats();
    expect(stats.totalOrders).toBe(2);
    expect(stats.pendingOrders).toBeGreaterThanOrEqual(1);
  });
});
