import { Injectable } from '@nestjs/common';
import { OrderPresenters } from '../presenters/order.presenters';
import { UpdateOrderStatusController } from '@modules/ordering/presentation/controllers';
import { OrderStatus } from '@modules/ordering/domain';

@Injectable()
export class UpdateOrderStatusEndpoint {
  constructor(private readonly controller: UpdateOrderStatusController) {}

  handle(dto: { id: string; status: OrderStatus }) {
    const response = this.controller.handle(dto);
    return response.success
      ? OrderPresenters.updated()
      : OrderPresenters.error('Order not found');
  }
}
