import { Injectable } from '@nestjs/common';
import { OrderPresenters } from '../presenters/order.presenters';
import { CreateSampleOrdersController } from '../../../presentation/controllers/create-sample-orders.controller';
import { I18nService } from '@modules/i18n/application/i18n.service';

@Injectable()
export class CreateSampleOrdersEndpoint {
  constructor(
    private readonly controller: CreateSampleOrdersController,
    private readonly i18n: I18nService,
  ) {}

  handle(dto: { locale: string }) {
    this.controller.handle();
    const message = this.i18n.translate(
      'orders_samples_created',
      {},
      dto.locale,
    );
    return OrderPresenters.started(message);
  }
}
