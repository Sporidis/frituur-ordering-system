import { Controller, Get } from '@nestjs/common';
import { GetStatsOverviewEndpoint } from '../endpoints/get-stats-overview.endpoint';

@Controller('orders')
export class GetStatsOverviewHttpController {
  constructor(private readonly endpoint: GetStatsOverviewEndpoint) {}

  @Get('stats/overview')
  handle() {
    return this.endpoint.handle();
  }
}
