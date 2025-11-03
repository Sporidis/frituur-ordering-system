import { Body, Controller, Post } from '@nestjs/common';
import { CreateOrderEndpoint } from '../endpoints/create-order.endpoint';
import type { OrderItem } from '@modules/ordering/domain';

@Controller('orders')
export class CreateOrderHttpController {
  constructor(private readonly endpoint: CreateOrderEndpoint) {}

  @Post()
  handle(
    @Body()
    body: {
      customerName: string;
      items: Omit<OrderItem, 'id'>[];
    },
  ) {
    return this.endpoint.handle(body);
  }
}
