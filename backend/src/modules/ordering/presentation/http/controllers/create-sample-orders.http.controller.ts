import { Controller, Post } from '@nestjs/common';
import { CreateSampleOrdersEndpoint } from '@modules/ordering/presentation/http/endpoints/create-sample-orders.endpoint';
import { CurrentLocale } from '@modules/i18n/presentation/http/decorators/current-locale.decorator';

@Controller('orders')
export class CreateSampleOrdersHttpController {
  constructor(private readonly endpoint: CreateSampleOrdersEndpoint) {}

  @Post('demo/create-sample')
  handle(@CurrentLocale() locale: string) {
    return this.endpoint.handle({ locale });
  }
}
