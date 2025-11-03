import { Injectable } from '@nestjs/common';
import { OrderService } from '../../order.service';
import { UseCase } from '@shared/application/usecase.interface';
import { UpdateOrderStatusRequest } from '../contracts/requests/update-order-status.request';
import { UpdateOrderStatusResponse } from '../contracts/responses/update-order-status.response';

@Injectable()
export class UpdateOrderStatusUseCase
  implements UseCase<UpdateOrderStatusRequest, UpdateOrderStatusResponse>
{
  constructor(private readonly orders: OrderService) {}

  execute(request: UpdateOrderStatusRequest): UpdateOrderStatusResponse {
    return {
      success: this.orders.updateOrderStatus(request.id, request.status),
    };
  }
}
