import { Injectable, Inject } from '@nestjs/common';
import { Endpoint } from '@shared/presentation/http/endpoint.interface';
import { I18nService } from '@modules/i18n/application/i18n.service';
import { RequestResponse } from '@shared/infrastructure/devices/request-response.device';
import { UpdateOrderStatusUseCase } from '@modules/order/application/use-cases/update-order-status.usecase';
import { UpdateOrderStatusController } from '@modules/order/infrastructure/http/controllers/update-order-status.controller';
import { UpdateOrderStatusPresenter } from '@modules/order/infrastructure/http/presenters/update-order-status.presenter';
import { ORDER_REPOSITORY } from '@modules/order/domain/repositories/order.repository';
import type { OrderRepository } from '@modules/order/domain/repositories/order.repository';
import { OrderStatus } from '@modules/order/domain';
import type {
  UpdateOrderStatusHttpResponse,
  NotFoundHttpResponse,
} from '../dto/update-order-status.response';
import { OrderPresenters } from '../presenters/order.presenters';

@Injectable()
export class UpdateOrderStatusEndpoint implements Endpoint {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: OrderRepository,
    private readonly i18n: I18nService,
  ) {}

  async handle(dto: {
    id: string;
    status: OrderStatus;
    locale: string;
  }): Promise<UpdateOrderStatusHttpResponse | NotFoundHttpResponse> {
    const device = new RequestResponse<
      UpdateOrderStatusHttpResponse | NotFoundHttpResponse
    >();
    const presenter = new UpdateOrderStatusPresenter(device);
    const useCase = new UpdateOrderStatusUseCase(
      presenter,
      this.orderRepository,
    );
    const controller = new UpdateOrderStatusController(useCase);

    await controller.handle({ id: dto.id, status: dto.status });

    const response = device.response;
    if (!response) {
      throw new Error('No response captured from use case');
    }

    if (response.success) {
      return OrderPresenters.updated(
        this.i18n.translate(
          'order_status_updated_success',
          { id: dto.id, status: dto.status },
          dto.locale,
        ),
      );
    } else {
      return OrderPresenters.error(
        this.i18n.translate('order_not_found', {}, dto.locale),
      );
    }
  }
}
