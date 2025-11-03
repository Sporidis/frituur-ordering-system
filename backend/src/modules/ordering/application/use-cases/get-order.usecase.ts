import { Injectable } from '@nestjs/common';
import { OrderService } from '../../order.service';
import { UseCase } from '@shared/application/usecase.interface';
import { GetOrderRequest } from '../contracts/requests/get-order.request';
import { GetOrderResponse } from '../contracts/responses/get-order.response';

@Injectable()
export class GetOrderUseCase
  implements UseCase<GetOrderRequest, GetOrderResponse>
{
  constructor(private readonly orders: OrderService) {}

  execute(request: GetOrderRequest): GetOrderResponse {
    return { order: this.orders.getOrder(request.id) };
  }
}
