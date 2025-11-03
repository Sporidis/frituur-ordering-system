import { Inject, Injectable } from '@nestjs/common';
import { ORDER_REPOSITORY } from '@modules/ordering/domain/repositories/order.repository';
import type { OrderRepository } from '@modules/ordering/domain/repositories/order.repository';
import { UseCase } from '@shared/application/usecase.interface';
import { GetOrderRequest } from '@modules/ordering/application/contracts/requests/get-order.request';
import { GetOrderResponse } from '@modules/ordering/application/contracts/responses/get-order.response';

@Injectable()
export class GetOrderUseCase
  implements UseCase<GetOrderRequest, GetOrderResponse>
{
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orders: OrderRepository,
  ) {}

  execute(request: GetOrderRequest): GetOrderResponse {
    return { order: this.orders.getOrder(request.id) };
  }
}
