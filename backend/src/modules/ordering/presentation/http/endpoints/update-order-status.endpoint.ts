import { Injectable } from '@nestjs/common';
import { OrderPresenters } from '../presenters/order.presenters';
import { UpdateOrderStatusController } from '@modules/ordering/presentation/controllers';
import { OrderStatus } from '@modules/ordering/domain';
import { I18nService } from '@modules/i18n/application/i18n.service';
import type {
  NotFoundHttpResponse,
  UpdateOrderStatusHttpResponse,
} from '../dto/update-order-status.response';
import { OrderTrackingGateway } from '@modules/ordering/infrastructure/order-tracking.gateway';
import { OrderService } from '@modules/ordering/order.service';

@Injectable()
export class UpdateOrderStatusEndpoint {
  constructor(
    private readonly controller: UpdateOrderStatusController,
    private readonly i18n: I18nService,
    private readonly gateway: OrderTrackingGateway,
    private readonly orders: OrderService,
  ) {}

  handle(dto: {
    id: string;
    status: OrderStatus;
    locale: string;
  }): UpdateOrderStatusHttpResponse | NotFoundHttpResponse {
    const response = this.controller.handle(dto);

    // Emit WebSocket event for status update
    if (response.success) {
      const order = this.orders.getOrder(dto.id);
      if (order) {
        this.gateway.emitOrderStatusUpdate(dto.id, order);
      }
    }

    return response.success
      ? OrderPresenters.updated(
          this.i18n.translate(
            'order_status_updated_success',
            { id: dto.id, status: dto.status },
            dto.locale,
          ),
        )
      : OrderPresenters.error(
          this.i18n.translate('order_not_found', {}, dto.locale),
        );
  }
}
