import { OrderPresenters } from '@modules/ordering/presentation/http/presenters/order.presenters';
import type { OrderView } from '@modules/ordering/presentation/http/types';

describe('OrderPresenters', () => {
  const mockOrder: OrderView = {
    id: 'o1',
    customerName: 'John',
    totalAmount: 10.5,
    status: 'pending',
  };

  it('should present created order with message', () => {
    const res = OrderPresenters.created(mockOrder, 'Order created');
    expect(res.success).toBe(true);
    expect(res.order).toEqual(mockOrder);
    expect(res.message).toBe('Order created');
  });

  it('should present single order with optional title', () => {
    const res1 = OrderPresenters.single(mockOrder, 'Order Details');
    expect(res1.success).toBe(true);
    expect(res1.order).toEqual(mockOrder);
    expect(res1.title).toBe('Order Details');

    const res2 = OrderPresenters.single(mockOrder);
    expect(res2.title).toBeUndefined();
  });

  it('should present list of orders with count and optional title', () => {
    const orders = [mockOrder];
    const res1 = OrderPresenters.list(orders, 'All Orders');
    expect(res1.success).toBe(true);
    expect(res1.orders).toEqual(orders);
    expect(res1.count).toBe(1);
    expect(res1.title).toBe('All Orders');

    const res2 = OrderPresenters.list(orders);
    expect(res2.title).toBeUndefined();
  });

  it('should present updated message', () => {
    const res = OrderPresenters.updated('Order updated');
    expect(res.success).toBe(true);
    expect(res.message).toBe('Order updated');
  });

  it('should present overview with stats and optional title', () => {
    const stats = { total: 5 };
    const res1 = OrderPresenters.overview({
      stats,
      connectedClients: {},
      totalConnectedClients: 0,
      title: 'Overview',
    });
    expect(res1.success).toBe(true);
    expect(res1.stats).toEqual(stats);
    expect(res1.title).toBe('Overview');

    const res2 = OrderPresenters.overview({
      stats,
      connectedClients: {},
      totalConnectedClients: 0,
    });
    expect(res2.title).toBeUndefined();
  });

  it('should present started message', () => {
    const res = OrderPresenters.started('Started');
    expect(res.success).toBe(true);
    expect(res.message).toBe('Started');
  });

  it('should present error', () => {
    const res = OrderPresenters.error('Error occurred');
    expect(res.success).toBe(false);
    expect(res.message).toBe('Error occurred');
  });
});
