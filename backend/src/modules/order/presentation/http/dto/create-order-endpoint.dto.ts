import type { OrderItem } from '@modules/order/domain';

/**
 * DTO for CreateOrderEndpoint.handle() method
 * Extracted from inline type for better type safety and reusability
 */
export interface CreateOrderEndpointDto {
  customerName: string;
  items: Omit<OrderItem, 'id'>[];
  locale: string;
}
