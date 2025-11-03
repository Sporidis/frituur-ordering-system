import { Injectable } from '@nestjs/common';
import { GetStatsOverviewController } from '@modules/ordering/presentation/controllers/get-stats-overview.controller';
import { OrderPresenters } from '@modules/ordering/presentation/http/presenters/order.presenters';
import { I18nService } from '@modules/i18n/application/i18n.service';
import type { GetStatsOverviewHttpResponse } from '@modules/ordering/presentation/http/dto';

@Injectable()
export class GetStatsOverviewEndpoint {
  constructor(
    private readonly controller: GetStatsOverviewController,
    private readonly i18n: I18nService,
  ) {}

  handle(dto: { locale: string }): GetStatsOverviewHttpResponse {
    const data = this.controller.handle();
    const title = this.i18n.translate('orders_overview_title', {}, dto.locale);
    return OrderPresenters.overview({ ...data, title });
  }
}
