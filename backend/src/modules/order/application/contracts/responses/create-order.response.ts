import type { OrderItem } from '@modules/order/domain';

export interface CreateOrderResponse {
  id: string;
  customerName: string;
  totalAmount: number;
  status: string;
  items: OrderItem[];
  estimatedReadyTime: Date;
  createdAt: Date;
}
