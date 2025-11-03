import { OrderStatus } from '../../../domain/order.types';

export interface UpdateOrderStatusRequest {
  id: string;
  status: OrderStatus;
}
