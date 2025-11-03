import { Injectable } from '@nestjs/common';
import { OrderService } from '../../order.service';
import { UseCase } from '@shared/application/usecase.interface';
import { CreateOrderRequest } from '../contracts/requests/create-order.request';
import { CreateOrderResponse } from '../contracts/responses/create-order.response';

@Injectable()
export class CreateOrderUseCase
  implements UseCase<CreateOrderRequest, CreateOrderResponse>
{
  constructor(private readonly orders: OrderService) {}

  execute(request: CreateOrderRequest): CreateOrderResponse {
    const order = this.orders.createOrder(request.customerName, request.items);
    return { id: order.id };
  }
}
