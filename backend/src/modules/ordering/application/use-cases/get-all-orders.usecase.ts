import { Injectable } from '@nestjs/common';
import { OrderService } from '../../order.service';
import { UseCase } from '@shared/application/usecase.interface';
import { GetAllOrdersRequest } from '../contracts/requests/get-all-orders.request';
import { GetAllOrdersResponse } from '../contracts/responses/get-all-orders.response';

@Injectable()
export class GetAllOrdersUseCase
  implements UseCase<GetAllOrdersRequest, GetAllOrdersResponse>
{
  constructor(private readonly orders: OrderService) {}

  execute(_: GetAllOrdersRequest): GetAllOrdersResponse {
    return { orders: this.orders.getAllOrders() };
  }
}
