import { Body, Controller, Post } from '@nestjs/common';
import { CreatePaymentIntentEndpoint } from '../endpoints/create-payment-intent.endpoint';
import { CreatePaymentIntentDto } from '../../dto/create-payment-intent.dto';
import { CurrentLocale } from '@modules/i18n/presentation/http/decorators/current-locale.decorator';

@Controller('payments')
export class CreatePaymentIntentHttpController {
  constructor(private readonly endpoint: CreatePaymentIntentEndpoint) {}

  @Post('create-intent')
  handle(
    @Body() body: CreatePaymentIntentDto,
    @CurrentLocale() locale: string,
  ) {
    return this.endpoint.handle({ ...body, locale });
  }
}
