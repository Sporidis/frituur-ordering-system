import { Inject, Injectable } from '@nestjs/common';
import {
  ORDER_REPOSITORY,
  type OrderRepository,
} from '@modules/ordering/domain/repositories/order.repository';
import { UseCase } from '@shared/application/usecase.interface';
import { CreateSampleOrdersRequest } from '@modules/ordering/application/contracts/requests/create-sample-orders.request';
import { CreateSampleOrdersResponse } from '@modules/ordering/application/contracts/responses/create-sample-orders.response';

@Injectable()
export class CreateSampleOrdersUseCase
  implements UseCase<CreateSampleOrdersRequest, CreateSampleOrdersResponse>
{
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orders: OrderRepository,
  ) {}

  execute(_: CreateSampleOrdersRequest): CreateSampleOrdersResponse {
    this.orders.createOrder('Alice', [
      { name: 'Fries', price: 3, quantity: 1 },
      { name: 'Bitterballen', price: 4, quantity: 1 },
    ]);
    this.orders.createOrder('Bob', [
      { name: 'Burger', price: 6.5, quantity: 1 },
    ]);
    return { message: 'Sample orders created' };
  }
}
