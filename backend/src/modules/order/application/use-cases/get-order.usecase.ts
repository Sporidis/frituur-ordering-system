import { Inject } from '@nestjs/common';
import { ORDER_REPOSITORY } from '@modules/order/domain/repositories/order.repository';
import type { OrderRepository } from '@modules/order/domain/repositories/order.repository';
import { UseCase } from '@shared/application/usecase.interface';
import type { OutputPort } from '@shared/application/contracts/output-port.interface';
import { GetOrderRequest } from '@modules/order/application/contracts/requests/get-order.request';
import { GetOrderResponse } from '@modules/order/application/contracts/responses/get-order.response';

export class GetOrderUseCase implements UseCase<GetOrderRequest> {
  constructor(
    private readonly outputPort: OutputPort<GetOrderResponse>,
    @Inject(ORDER_REPOSITORY) private readonly orders: OrderRepository,
  ) {}

  async execute(input: GetOrderRequest): Promise<void> {
    const order = await this.orders.getOrder(input.id);
    this.outputPort.present({ order });
  }
}
