import type { Order, OrderItem, OrderStatus } from '@modules/order/domain';

export const ORDER_REPOSITORY = 'ORDER_REPOSITORY';

/**
 * OrderRepository interface (async)
 * All methods return Promises to support database operations
 */
export interface OrderRepository {
  createOrder(
    customerName: string,
    items: Omit<OrderItem, 'id'>[],
    totalAmount?: number,
  ): Promise<Order>;

  updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    message?: string,
  ): Promise<boolean>;

  getOrder(orderId: string): Promise<Order | undefined>;

  getAllOrders(): Promise<Order[]>;

  getOrderStats(): Promise<any>;
}
