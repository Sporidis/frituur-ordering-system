import { IsEnum } from 'class-validator';
import { OrderStatus } from '@modules/ordering/domain';

export class UpdateOrderStatusHttpRequest {
  @IsEnum(OrderStatus)
  status!: OrderStatus;
}
