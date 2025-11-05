import { Injectable, Inject } from '@nestjs/common';
import { Endpoint } from '@shared/presentation/http/endpoint.interface';
import { I18nService } from '@modules/i18n/application/i18n.service';
import { RequestResponse } from '@shared/infrastructure/devices/request-response.device';
import { CreateSampleOrdersUseCase } from '@modules/order/application/use-cases/create-sample-orders.usecase';
import { CreateSampleOrdersController } from '@modules/order/infrastructure/http/controllers/create-sample-orders.controller';
import {
  CreateSampleOrdersPresenter,
  CreateSampleOrdersHttpResponse,
} from '@modules/order/infrastructure/http/presenters/create-sample-orders.presenter';
import { ORDER_REPOSITORY } from '@modules/order/domain/repositories/order.repository';
import type { OrderRepository } from '@modules/order/domain/repositories/order.repository';
import { OrderPresenters } from '../presenters/order.presenters';

@Injectable()
export class CreateSampleOrdersEndpoint implements Endpoint {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: OrderRepository,
    private readonly i18n: I18nService,
  ) {}

  async handle(dto: { locale: string }) {
    const device = new RequestResponse<CreateSampleOrdersHttpResponse>();
    const presenter = new CreateSampleOrdersPresenter(device);
    const useCase = new CreateSampleOrdersUseCase(
      presenter,
      this.orderRepository,
    );
    const controller = new CreateSampleOrdersController(useCase);

    await controller.handle();

    const response = device.response;
    if (!response) {
      throw new Error('No response captured from use case');
    }

    const message = this.i18n.translate(
      'orders_samples_created',
      {},
      dto.locale,
    );

    return OrderPresenters.started(message);
  }
}
