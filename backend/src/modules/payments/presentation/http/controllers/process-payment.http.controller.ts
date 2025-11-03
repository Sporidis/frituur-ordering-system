import { Body, Controller, Post } from '@nestjs/common';
import { ProcessPaymentEndpoint } from '../endpoints/process-payment.endpoint';
import { ProcessPaymentDto } from '../../dto/process-payment.dto';

@Controller('payments')
export class ProcessPaymentHttpController {
  constructor(private readonly endpoint: ProcessPaymentEndpoint) {}

  @Post('process')
  handle(@Body() body: ProcessPaymentDto) {
    return this.endpoint.handle(body);
  }
}
