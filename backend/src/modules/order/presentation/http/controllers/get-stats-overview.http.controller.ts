import { Controller, Get } from '@nestjs/common';
import { GetStatsOverviewEndpoint } from '@modules/order/presentation/http/endpoints/get-stats-overview.endpoint';
import { CurrentLocale } from '@modules/i18n/presentation/http/decorators/current-locale.decorator';

@Controller('orders')
export class GetStatsOverviewHttpController {
  constructor(private readonly endpoint: GetStatsOverviewEndpoint) {}

  @Get('stats/overview')
  handle(@CurrentLocale() locale: string) {
    return this.endpoint.handle({ locale });
  }
}
