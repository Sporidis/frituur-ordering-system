import type { Order } from '../../../domain/order.types';

export interface GetOrderResponse {
  order: Order | undefined;
}
