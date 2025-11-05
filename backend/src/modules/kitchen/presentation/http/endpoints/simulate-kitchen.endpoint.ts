import { Injectable, Inject } from '@nestjs/common';
import { Endpoint } from '@shared/presentation/http/endpoint.interface';
import { I18nService } from '@modules/i18n/application/i18n.service';
import { RequestResponse } from '@shared/infrastructure/devices/request-response.device';
import { SimulateKitchenUseCase } from '@modules/kitchen/application/use-cases/simulate-kitchen.usecase';
import { SimulateKitchenController } from '@modules/kitchen/infrastructure/http/controllers/simulate-kitchen.controller';
import {
  SimulateKitchenPresenter,
  SimulateKitchenHttpResponse,
} from '@modules/kitchen/infrastructure/http/presenters/simulate-kitchen.presenter';
import { ORDER_REPOSITORY } from '@modules/order/domain/repositories/order.repository';
import type { OrderRepository } from '@modules/order/domain/repositories/order.repository';
import { KitchenPresenters } from '../presenters/kitchen.presenters';

@Injectable()
export class SimulateKitchenEndpoint implements Endpoint {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: OrderRepository,
    private readonly i18n: I18nService,
  ) {}

  async handle(dto: { locale: string }) {
    const device = new RequestResponse<SimulateKitchenHttpResponse>();
    const presenter = new SimulateKitchenPresenter(device);
    const useCase = new SimulateKitchenUseCase(presenter, this.orderRepository);
    const controller = new SimulateKitchenController(useCase);

    await controller.handle();

    const response = device.response;
    if (!response) {
      throw new Error('No response captured from use case');
    }

    const message = this.i18n.translate(
      'kitchen_simulation_started',
      {},
      dto.locale,
    );

    return KitchenPresenters.started(message);
  }
}
