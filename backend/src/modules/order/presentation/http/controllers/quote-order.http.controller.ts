import { Body, Controller, Post } from '@nestjs/common';
import { QuoteOrderEndpoint } from '@modules/order/presentation/http/endpoints/quote-order.endpoint';
import { QuoteOrderHttpRequest } from '@modules/order/presentation/http/dto/quote-order.request';
import { CurrentLocale } from '@modules/i18n/presentation/http/decorators/current-locale.decorator';

@Controller('orders')
export class QuoteOrderHttpController {
  constructor(private readonly endpoint: QuoteOrderEndpoint) {}

  @Post('quote')
  handle(@Body() body: QuoteOrderHttpRequest, @CurrentLocale() locale: string) {
    return this.endpoint.handle({ ...body, locale });
  }
}
