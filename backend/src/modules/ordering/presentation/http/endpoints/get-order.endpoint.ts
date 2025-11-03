import { Injectable } from '@nestjs/common';
import { OrderPresenters } from '../presenters/order.presenters';
import { GetOrderController } from '@modules/ordering/presentation/controllers';
import { Endpoint } from '@shared/presentation/http/endpoint.interface';
import { I18nService } from '@modules/i18n/application/i18n.service';
import type { GetOrderHttpResponse } from '../dto/get-order.response';

@Injectable()
export class GetOrderEndpoint implements Endpoint {
  constructor(
    private readonly controller: GetOrderController,
    private readonly i18n: I18nService,
  ) {}

  handle(dto: {
    id: string;
    locale: string;
  }): GetOrderHttpResponse | { success: false; message: string } {
    const response = this.controller.handle({ id: dto.id });
    if (!response.order) {
      return {
        success: false,
        message: this.i18n.translate('order_not_found', {}, dto.locale),
      };
    }
    const title = this.i18n.translate(
      'order_details_title',
      { id: dto.id },
      dto.locale,
    );
    const order = response.order;
    const orderView = {
      id: order.id,
      customerName: order.customerName,
      totalAmount: order.totalAmount,
      status: order.status,
      items: order.items.map((it) => ({
        id: it.id,
        name: it.name,
        price: it.price,
        quantity: it.quantity,
      })),
      estimatedReadyTime: order.estimatedReadyTime.toISOString(),
      createdAt: order.createdAt.toISOString(),
    };
    return OrderPresenters.single(orderView, title);
  }
}
