import { Injectable } from '@nestjs/common';
import { OrderPresenters } from '../presenters/order.presenters';
import { GetAllOrdersController } from '@modules/ordering/presentation/controllers';
import { Endpoint } from '@shared/presentation/http/endpoint.interface';

@Injectable()
export class GetAllOrdersEndpoint implements Endpoint {
  constructor(private readonly controller: GetAllOrdersController) {}

  handle() {
    const response = this.controller.handle();
    return OrderPresenters.list(response.orders);
  }
}
