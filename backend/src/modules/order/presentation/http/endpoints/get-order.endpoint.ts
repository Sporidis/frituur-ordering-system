import { Injectable, Inject } from '@nestjs/common';
import { Endpoint } from '@shared/presentation/http/endpoint.interface';
import { I18nService } from '@modules/i18n/application/i18n.service';
import { RequestResponse } from '@shared/infrastructure/devices/request-response.device';
import { GetOrderUseCase } from '@modules/order/application/use-cases/get-order.usecase';
import { GetOrderController } from '@modules/order/infrastructure/http/controllers/get-order.controller';
import { GetOrderPresenter } from '@modules/order/infrastructure/http/presenters/get-order.presenter';
import { ORDER_REPOSITORY } from '@modules/order/domain/repositories/order.repository';
import type { OrderRepository } from '@modules/order/domain/repositories/order.repository';
import type { GetOrderHttpResponse } from '../dto/get-order.response';
import { OrderPresenters } from '../presenters/order.presenters';

@Injectable()
export class GetOrderEndpoint implements Endpoint {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: OrderRepository,
    private readonly i18n: I18nService,
  ) {}

  async handle(dto: {
    id: string;
    locale: string;
  }): Promise<GetOrderHttpResponse | { success: false; message: string }> {
    const device = new RequestResponse<GetOrderHttpResponse>();
    const presenter = new GetOrderPresenter(device);
    const useCase = new GetOrderUseCase(presenter, this.orderRepository);
    const controller = new GetOrderController(useCase);

    await controller.handle({ id: dto.id });

    const response = device.response;
    if (!response) {
      return {
        success: false,
        message: this.i18n.translate('order_not_found', {}, dto.locale),
      };
    }

    const title = this.i18n.translate(
      'order_details_title',
      { id: dto.id },
      dto.locale,
    );

    return OrderPresenters.single(response.order, title);
  }
}
