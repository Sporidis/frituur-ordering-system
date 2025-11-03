import type { Order } from '../../../domain/order.types';

export interface GetAllOrdersResponse {
  orders: Order[];
}
