import { Injectable } from '@nestjs/common';
import { OrderPresenters } from '../presenters/order.presenters';
import { CreateSampleOrdersController } from '../../../presentation/controllers/create-sample-orders.controller';

@Injectable()
export class CreateSampleOrdersEndpoint {
  constructor(private readonly controller: CreateSampleOrdersController) {}

  handle() {
    this.controller.handle();
    return OrderPresenters.started('Sample orders created');
  }
}
