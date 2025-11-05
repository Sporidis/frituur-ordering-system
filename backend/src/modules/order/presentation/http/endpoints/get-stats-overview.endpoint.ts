import { Injectable, Inject } from '@nestjs/common';
import { Endpoint } from '@shared/presentation/http/endpoint.interface';
import { I18nService } from '@modules/i18n/application/i18n.service';
import { RequestResponse } from '@shared/infrastructure/devices/request-response.device';
import { GetStatsOverviewUseCase } from '@modules/order/application/use-cases/get-stats-overview.usecase';
import { GetStatsOverviewController } from '@modules/order/infrastructure/http/controllers/get-stats-overview.controller';
import { GetStatsOverviewPresenter } from '@modules/order/infrastructure/http/presenters/get-stats-overview.presenter';
import { ORDER_REPOSITORY } from '@modules/order/domain/repositories/order.repository';
import type { OrderRepository } from '@modules/order/domain/repositories/order.repository';
import type { GetStatsOverviewHttpResponse } from '../dto/get-stats-overview.response';
import { OrderPresenters } from '../presenters/order.presenters';

@Injectable()
export class GetStatsOverviewEndpoint implements Endpoint {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: OrderRepository,
    private readonly i18n: I18nService,
  ) {}

  async handle(dto: { locale: string }): Promise<GetStatsOverviewHttpResponse> {
    const device = new RequestResponse<GetStatsOverviewHttpResponse>();
    const presenter = new GetStatsOverviewPresenter(device);
    const useCase = new GetStatsOverviewUseCase(
      presenter,
      this.orderRepository,
    );
    const controller = new GetStatsOverviewController(useCase);

    await controller.handle();

    const response = device.response;
    if (!response) {
      throw new Error('No response captured from use case');
    }

    const title = this.i18n.translate('orders_overview_title', {}, dto.locale);

    return OrderPresenters.overview({ ...response, title });
  }
}
