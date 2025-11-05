import { Body, Controller, Post } from '@nestjs/common';
import { CreateOrderEndpoint } from '@modules/order/presentation/http/endpoints/create-order.endpoint';
import { CreateOrderHttpRequest } from '@modules/order/presentation/http/dto';
import { CreateOrderEndpointDto } from '@modules/order/presentation/http/dto/create-order-endpoint.dto';
import { CurrentLocale } from '@modules/i18n/presentation/http/decorators/current-locale.decorator';

@Controller('orders')
export class CreateOrderHttpController {
  constructor(private readonly endpoint: CreateOrderEndpoint) {}

  @Post()
  handle(
    @Body() body: CreateOrderHttpRequest,
    @CurrentLocale() locale: string,
  ) {
    const dto = this.mapRequestToDto(body, locale);
    return this.endpoint.handle(dto);
  }

  private mapRequestToDto(
    request: CreateOrderHttpRequest,
    locale: string,
  ): CreateOrderEndpointDto {
    return {
      customerName: request.customerName,
      items: request.items,
      locale,
    };
  }
}
