import { Controller, Get } from '@nestjs/common';
import { GetAllOrdersEndpoint } from '../endpoints/get-all-orders.endpoint';
import { CurrentLocale } from '@modules/i18n/presentation/http/decorators/current-locale.decorator';

@Controller('orders')
export class GetAllOrdersHttpController {
  constructor(private readonly endpoint: GetAllOrdersEndpoint) {}

  @Get()
  handle(@CurrentLocale() locale: string) {
    return this.endpoint.handle({ locale });
  }
}
