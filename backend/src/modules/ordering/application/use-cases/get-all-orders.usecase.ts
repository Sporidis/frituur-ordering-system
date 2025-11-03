import { Inject, Injectable } from '@nestjs/common';
import {
  ORDER_REPOSITORY,
  type OrderRepository,
} from '../../domain/repositories/order.repository';
import { UseCase } from '@shared/application/usecase.interface';
import { GetAllOrdersRequest } from '../contracts/requests/get-all-orders.request';
import { GetAllOrdersResponse } from '../contracts/responses/get-all-orders.response';

@Injectable()
export class GetAllOrdersUseCase
  implements UseCase<GetAllOrdersRequest, GetAllOrdersResponse>
{
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orders: OrderRepository,
  ) {}

  execute(_: GetAllOrdersRequest): GetAllOrdersResponse {
    return { orders: this.orders.getAllOrders() };
  }
}
