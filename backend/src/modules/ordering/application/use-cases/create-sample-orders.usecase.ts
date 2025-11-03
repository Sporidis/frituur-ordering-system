import { Injectable } from '@nestjs/common';
import { OrderService } from '../../order.service';
import { UseCase } from '@shared/application/usecase.interface';
import { CreateSampleOrdersRequest } from '../contracts/requests/create-sample-orders.request';
import { CreateSampleOrdersResponse } from '../contracts/responses/create-sample-orders.response';

@Injectable()
export class CreateSampleOrdersUseCase
  implements UseCase<CreateSampleOrdersRequest, CreateSampleOrdersResponse>
{
  constructor(private readonly orders: OrderService) {}

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
