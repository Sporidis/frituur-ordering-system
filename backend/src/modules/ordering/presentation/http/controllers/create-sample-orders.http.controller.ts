import { Controller, Post } from '@nestjs/common';
import { CreateSampleOrdersEndpoint } from '../endpoints/create-sample-orders.endpoint';

@Controller('orders')
export class CreateSampleOrdersHttpController {
  constructor(private readonly endpoint: CreateSampleOrdersEndpoint) {}

  @Post('seed')
  handle() {
    return this.endpoint.handle();
  }
}
