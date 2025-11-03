import { Injectable } from '@nestjs/common';
import type { OrderItem } from '@modules/ordering/domain';
import { OrderPresenters } from '../presenters/order.presenters';
import { CreateOrderController } from '@modules/ordering/presentation/controllers';
import { Endpoint } from '@shared/presentation/http/endpoint.interface';
import { I18nService } from '@modules/i18n/application/i18n.service';
import type { CreateOrderHttpResponse } from '../dto/create-order.response';
import { OrderTrackingGateway } from '@modules/ordering/infrastructure/order-tracking.gateway';
import { OrderService } from '@modules/ordering/order.service';

@Injectable()
export class CreateOrderEndpoint implements Endpoint {
  constructor(
    private readonly controller: CreateOrderController,
    private readonly i18n: I18nService,
    private readonly gateway: OrderTrackingGateway,
    private readonly orders: OrderService,
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

    // Emit WebSocket event for new order
    const order = this.orders.getOrder(result.id);
    if (order) {
      this.gateway.emitNewOrder(order);
    }

    const full = this.orders.getOrder(result.id)!;
    const orderView = {
      id: result.id,
      customerName: result.customerName,
      totalAmount: result.totalAmount,
      status: result.status,
      items: full.items.map((it) => ({
        id: it.id,
        name: it.name,
        price: it.price,
        quantity: it.quantity,
      })),
      estimatedReadyTime: full.estimatedReadyTime.toISOString(),
      createdAt: full.createdAt.toISOString(),
    };
    return OrderPresenters.created(orderView, message);
  }
}
