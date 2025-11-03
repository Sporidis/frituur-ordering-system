import { Controller, Get, Param } from '@nestjs/common';
import { GetOrderEndpoint } from '../endpoints/get-order.endpoint';

@Controller('orders')
export class GetOrderHttpController {
  constructor(private readonly endpoint: GetOrderEndpoint) {}

  @Get(':id')
  handle(@Param('id') id: string) {
    return this.endpoint.handle({ id });
  }
}
