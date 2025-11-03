import { Body, Controller, Post } from '@nestjs/common';
import { CreatePaymentIntentEndpoint } from '../endpoints/create-payment-intent.endpoint';
import type { CreatePaymentIntentRequest } from '../../contracts/requests/create-payment-intent.request';

@Controller('payments')
export class CreatePaymentIntentHttpController {
  constructor(private readonly endpoint: CreatePaymentIntentEndpoint) {}

  @Post('create-intent')
  handle(@Body() body: CreatePaymentIntentRequest) {
    return this.endpoint.handle(body);
  }
}
