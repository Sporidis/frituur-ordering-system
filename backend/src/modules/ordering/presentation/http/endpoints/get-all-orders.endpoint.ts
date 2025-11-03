import { Injectable } from '@nestjs/common';
import { OrderPresenters } from '../presenters/order.presenters';
import { GetAllOrdersController } from '@modules/ordering/presentation/controllers';
import { Endpoint } from '@shared/presentation/http/endpoint.interface';
import { I18nService } from '@modules/i18n/application/i18n.service';
import type { GetAllOrdersHttpResponse } from '@modules/ordering/presentation/http/dto';

@Injectable()
export class GetAllOrdersEndpoint implements Endpoint {
  constructor(
    private readonly controller: GetAllOrdersController,
    private readonly i18n: I18nService,
  ) {}

  handle(dto: { locale: string }): GetAllOrdersHttpResponse {
    const response = this.controller.handle();
    const title = this.i18n.translate('orders_list_title', {}, dto.locale);
    const views = response.orders.map((o) => ({
      id: o.id,
      customerName: o.customerName,
      totalAmount: o.totalAmount,
      status: o.status,
      items: o.items.map((it) => ({
        id: it.id,
        name: it.name,
        price: it.price,
        quantity: it.quantity,
      })),
      estimatedReadyTime: o.estimatedReadyTime.toISOString(),
      createdAt: o.createdAt.toISOString(),
    }));
    return OrderPresenters.list(views, title);
  }
}
