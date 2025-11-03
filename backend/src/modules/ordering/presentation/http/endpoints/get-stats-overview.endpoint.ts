import { Injectable } from '@nestjs/common';
import { GetStatsOverviewController } from '@modules/ordering/presentation/controllers/get-stats-overview.controller';
import { OrderPresenters } from '@modules/ordering/presentation/http/presenters/order.presenters';

@Injectable()
export class GetStatsOverviewEndpoint {
  constructor(private readonly controller: GetStatsOverviewController) {}

  handle() {
    const data = this.controller.handle();
    return OrderPresenters.overview(data);
  }
}
