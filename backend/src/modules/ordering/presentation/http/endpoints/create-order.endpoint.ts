import { Injectable } from '@nestjs/common';
import type { OrderItem } from '@modules/ordering/domain';
import { OrderPresenters } from '../presenters/order.presenters';
import { CreateOrderController } from '@modules/ordering/presentation/controllers';
import { Endpoint } from '@shared/presentation/http/endpoint.interface';
import { I18nService } from '@modules/i18n/application/i18n.service';
import type { CreateOrderHttpResponse } from '../dto/create-order.response';

@Injectable()
export class CreateOrderEndpoint implements Endpoint {
  constructor(
    private readonly controller: CreateOrderController,
    private readonly i18n: I18nService,
  ) {}

  handle(dto: {
    customerName: string;
    items: Omit<OrderItem, 'id'>[];
    locale: string;
  }): CreateOrderHttpResponse {
    const result = this.controller.handle(dto);
    const message = this.i18n.translate(
      'order_created_success',
      { id: result.id },
      dto.locale,
    );
    const orderView = {
      id: result.id,
      customerName: result.customerName,
      totalAmount: result.totalAmount,
      status: result.status,
    };
    return OrderPresenters.created(orderView, message);
  }
}
