import { Controller, Get, Param } from '@nestjs/common';
import { GetOrderEndpoint } from '@modules/order/presentation/http/endpoints/get-order.endpoint';
import { CurrentLocale } from '@modules/i18n/presentation/http/decorators/current-locale.decorator';

@Controller('orders')
export class GetOrderHttpController {
  constructor(private readonly endpoint: GetOrderEndpoint) {}

  @Get(':id')
  handle(@Param('id') id: string, @CurrentLocale() locale: string) {
    return this.endpoint.handle({ id, locale });
  }
}
