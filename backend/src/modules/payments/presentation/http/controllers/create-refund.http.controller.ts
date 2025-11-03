import { Body, Controller, Post } from '@nestjs/common';
import { CreateRefundEndpoint } from '../endpoints/create-refund.endpoint';
import type { CreateRefundRequest } from '../../contracts/requests/create-refund.request';

@Controller('payments')
export class CreateRefundHttpController {
  constructor(private readonly endpoint: CreateRefundEndpoint) {}

  @Post('refund')
  handle(@Body() body: CreateRefundRequest) {
    return this.endpoint.handle(body);
  }
}
