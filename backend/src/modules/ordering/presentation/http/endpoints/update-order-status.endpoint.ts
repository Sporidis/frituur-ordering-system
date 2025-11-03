import { Injectable } from '@nestjs/common';
import { OrderPresenters } from '../presenters/order.presenters';
import { UpdateOrderStatusController } from '@modules/ordering/presentation/controllers';
import { OrderStatus } from '@modules/ordering/domain';
import { I18nService } from '@modules/i18n/application/i18n.service';
import type {
  NotFoundHttpResponse,
  UpdateOrderStatusHttpResponse,
} from '../dto/update-order-status.response';

@Injectable()
export class UpdateOrderStatusEndpoint {
  constructor(
    private readonly controller: UpdateOrderStatusController,
    private readonly i18n: I18nService,
  ) {}

  handle(dto: {
    id: string;
    status: OrderStatus;
    locale: string;
  }): UpdateOrderStatusHttpResponse | NotFoundHttpResponse {
    const response = this.controller.handle(dto);
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
