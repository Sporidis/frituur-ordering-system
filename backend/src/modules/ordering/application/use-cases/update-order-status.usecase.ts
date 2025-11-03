import { Inject, Injectable } from '@nestjs/common';
import {
  ORDER_REPOSITORY,
  type OrderRepository,
} from '@modules/ordering/domain/repositories/order.repository';
import { UpdateOrderStatusRequest } from '@modules/ordering/application/contracts/requests/update-order-status.request';
import { UpdateOrderStatusResponse } from '@modules/ordering/application/contracts/responses/update-order-status.response';
import { UseCase } from '@shared/application/usecase.interface';

@Injectable()
export class UpdateOrderStatusUseCase
  implements UseCase<UpdateOrderStatusRequest, UpdateOrderStatusResponse>
{
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orders: OrderRepository,
  ) {}
  execute(request: UpdateOrderStatusRequest): UpdateOrderStatusResponse {
    return {
      success: this.orders.updateOrderStatus(request.id, request.status),
    };
  }
}
