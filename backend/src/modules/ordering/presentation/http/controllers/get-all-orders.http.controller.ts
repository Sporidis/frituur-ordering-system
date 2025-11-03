import { Controller, Get } from '@nestjs/common';
import { GetAllOrdersEndpoint } from '../endpoints/get-all-orders.endpoint';

@Controller('orders')
export class GetAllOrdersHttpController {
  constructor(private readonly endpoint: GetAllOrdersEndpoint) {}

  @Get()
  handle() {
    return this.endpoint.handle();
  }
}
