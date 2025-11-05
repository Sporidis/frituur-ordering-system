import type { OrderItem } from '../../../domain/order.types';

export interface CreateOrderRequest {
  customerName: string;
  items: Omit<OrderItem, 'id'>[];
}
