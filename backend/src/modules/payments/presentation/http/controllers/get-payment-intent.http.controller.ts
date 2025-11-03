import { Controller, Get, Param } from '@nestjs/common';
import { GetPaymentIntentEndpoint } from '../endpoints/get-payment-intent.endpoint';

@Controller('payments')
export class GetPaymentIntentHttpController {
  constructor(private readonly endpoint: GetPaymentIntentEndpoint) {}

  @Get('intent/:id')
  handle(@Param('id') id: string) {
    return this.endpoint.handle(id);
  }
}
