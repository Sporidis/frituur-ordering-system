import { Injectable, Inject } from '@nestjs/common';
import { Endpoint } from '@shared/presentation/http/endpoint.interface';
import { I18nService } from '@modules/i18n/application/i18n.service';
import { RequestResponse } from '@shared/infrastructure/devices/request-response.device';
import { GetAllOrdersUseCase } from '@modules/order/application/use-cases/get-all-orders.usecase';
import { GetAllOrdersController } from '@modules/order/infrastructure/http/controllers/get-all-orders.controller';
import { GetAllOrdersPresenter } from '@modules/order/infrastructure/http/presenters/get-all-orders.presenter';
import { ORDER_REPOSITORY } from '@modules/order/domain/repositories/order.repository';
import type { OrderRepository } from '@modules/order/domain/repositories/order.repository';
import type { GetAllOrdersHttpResponse } from '../dto/get-all-orders.response';
import { OrderPresenters } from '../presenters/order.presenters';

@Injectable()
export class GetAllOrdersEndpoint implements Endpoint {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: OrderRepository,
    private readonly i18n: I18nService,
  ) {}

  async handle(dto: { locale: string }): Promise<GetAllOrdersHttpResponse> {
    const device = new RequestResponse<GetAllOrdersHttpResponse>();
    const presenter = new GetAllOrdersPresenter(device);
    const useCase = new GetAllOrdersUseCase(presenter, this.orderRepository);
    const controller = new GetAllOrdersController(useCase);

    await controller.handle();

    const response = device.response;
    if (!response) {
      throw new Error('No response captured from use case');
    }

    const title = this.i18n.translate('orders_list_title', {}, dto.locale);

    return OrderPresenters.list(response.orders, title);
  }
}
