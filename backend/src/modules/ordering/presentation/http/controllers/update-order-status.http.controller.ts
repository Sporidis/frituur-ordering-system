import { Body, Controller, Param, Patch } from '@nestjs/common';
import { UpdateOrderStatusEndpoint } from '@modules/ordering/presentation/http/endpoints/update-order-status.endpoint';
import { UpdateOrderStatusHttpRequest } from '@modules/ordering/presentation/http/dto';
import { CurrentLocale } from '@modules/i18n/presentation/http/decorators/current-locale.decorator';

@Controller('orders')
export class UpdateOrderStatusHttpController {
  constructor(private readonly endpoint: UpdateOrderStatusEndpoint) {}

  @Patch(':id/status')
  handle(
    @Param('id') id: string,
    @Body() body: UpdateOrderStatusHttpRequest,
    @CurrentLocale() locale: string,
  ) {
    return this.endpoint.handle({ id, status: body.status, locale });
  }
}
