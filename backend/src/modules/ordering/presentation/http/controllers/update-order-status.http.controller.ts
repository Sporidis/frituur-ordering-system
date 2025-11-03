import { Body, Controller, Param, Patch } from '@nestjs/common';
import { UpdateOrderStatusEndpoint } from '../endpoints/update-order-status.endpoint';
import { OrderStatus } from '@modules/ordering/domain';

@Controller('orders')
export class UpdateOrderStatusHttpController {
  constructor(private readonly endpoint: UpdateOrderStatusEndpoint) {}

  @Patch(':id/status')
  handle(
    @Param('id') id: string,
    @Body()
    body: {
      status: OrderStatus;
    },
  ) {
    return this.endpoint.handle({ id, status: body.status });
  }
}
