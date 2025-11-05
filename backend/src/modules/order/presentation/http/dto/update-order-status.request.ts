import { IsEnum } from 'class-validator';
import { OrderStatus } from '@modules/order/domain';

export class UpdateOrderStatusHttpRequest {
  @IsEnum(OrderStatus)
  status!: OrderStatus;
}
