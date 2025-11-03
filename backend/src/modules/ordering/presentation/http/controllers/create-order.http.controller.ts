import { Body, Controller, Post } from '@nestjs/common';
import { CreateOrderEndpoint } from '@modules/ordering/presentation/http/endpoints/create-order.endpoint';
import { CreateOrderHttpRequest } from '@modules/ordering/presentation/http/dto';
import { CurrentLocale } from '@modules/i18n/presentation/http/decorators/current-locale.decorator';

@Controller('orders')
export class CreateOrderHttpController {
  constructor(private readonly endpoint: CreateOrderEndpoint) {}

  @Post()
  handle(
    @Body() body: CreateOrderHttpRequest,
    @CurrentLocale() locale: string,
  ) {
    return this.endpoint.handle({ ...body, locale });
  }
}
