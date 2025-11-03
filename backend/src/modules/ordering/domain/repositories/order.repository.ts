import type { Order, OrderItem, OrderStatus } from '@modules/ordering/domain';

export const ORDER_REPOSITORY = 'ORDER_REPOSITORY';

export interface OrderRepository {
  createOrder(
    customerName: string,
    items: Omit<OrderItem, 'id'>[],
    totalAmount?: number,
  ): Order;
  updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    message?: string,
  ): boolean;
  getOrder(orderId: string): Order | undefined;
  getAllOrders(): Order[];
  getOrderStats(): any;
}
