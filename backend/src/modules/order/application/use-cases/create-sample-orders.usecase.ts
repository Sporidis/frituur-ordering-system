import { Inject } from '@nestjs/common';
import { ORDER_REPOSITORY } from '@modules/order/domain/repositories/order.repository';
import type { OrderRepository } from '@modules/order/domain/repositories/order.repository';
import { UseCase } from '@shared/application/usecase.interface';
import type { OutputPort } from '@shared/application/contracts/output-port.interface';
import { CreateSampleOrdersRequest } from '@modules/order/application/contracts/requests/create-sample-orders.request';
import { CreateSampleOrdersResponse } from '@modules/order/application/contracts/responses/create-sample-orders.response';

export class CreateSampleOrdersUseCase
  implements UseCase<CreateSampleOrdersRequest>
{
  constructor(
    private readonly outputPort: OutputPort<CreateSampleOrdersResponse>,
    @Inject(ORDER_REPOSITORY) private readonly orders: OrderRepository,
  ) {}

  async execute(_: CreateSampleOrdersRequest): Promise<void> {
    await this.orders.createOrder('Alice', [
      { name: 'Fries', price: 3, quantity: 1 },
      { name: 'Bitterballen', price: 4, quantity: 1 },
    ]);
    await this.orders.createOrder('Bob', [
      { name: 'Burger', price: 6.5, quantity: 1 },
    ]);
    this.outputPort.present({ message: 'Sample orders created' });
  }
}
