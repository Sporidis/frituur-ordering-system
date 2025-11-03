import { Injectable } from '@nestjs/common';
import type { OrderItem } from '@modules/ordering/domain';
import { OrderPresenters } from '../presenters/order.presenters';
import { CreateOrderController } from '@modules/ordering/presentation/controllers';
import { Endpoint } from '@shared/presentation/http/endpoint.interface';

@Injectable()
export class CreateOrderEndpoint implements Endpoint {
  constructor(private readonly controller: CreateOrderController) {}

  handle(dto: { customerName: string; items: Omit<OrderItem, 'id'>[] }) {
    const result = this.controller.handle(dto);
    return OrderPresenters.created({ id: result.id, ...dto });
  }
}
