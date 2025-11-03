import { Injectable } from '@nestjs/common';
import { OrderPresenters } from '../presenters/order.presenters';
import { GetOrderController } from '@modules/ordering/presentation/controllers';
import { Endpoint } from '@shared/presentation/http/endpoint.interface';

@Injectable()
export class GetOrderEndpoint implements Endpoint {
  constructor(private readonly controller: GetOrderController) {}

  handle(dto: { id: string }) {
    const response = this.controller.handle(dto);
    return OrderPresenters.single(response.order);
  }
}
