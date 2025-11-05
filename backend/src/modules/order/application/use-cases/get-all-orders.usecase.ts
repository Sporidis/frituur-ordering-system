import { Inject } from '@nestjs/common';
import { ORDER_REPOSITORY } from '../../domain/repositories/order.repository';
import type { OrderRepository } from '../../domain/repositories/order.repository';
import { UseCase } from '@shared/application/usecase.interface';
import type { OutputPort } from '@shared/application/contracts/output-port.interface';
import { GetAllOrdersRequest } from '../contracts/requests/get-all-orders.request';
import { GetAllOrdersResponse } from '../contracts/responses/get-all-orders.response';

export class GetAllOrdersUseCase implements UseCase<GetAllOrdersRequest> {
  constructor(
    private readonly outputPort: OutputPort<GetAllOrdersResponse>,
    @Inject(ORDER_REPOSITORY) private readonly orders: OrderRepository,
  ) {}

  async execute(_: GetAllOrdersRequest): Promise<void> {
    const orders = await this.orders.getAllOrders();
    this.outputPort.present({ orders });
  }
}
