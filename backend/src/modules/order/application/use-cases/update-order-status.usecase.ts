import { Inject } from '@nestjs/common';
import { ORDER_REPOSITORY } from '@modules/order/domain/repositories/order.repository';
import type { OrderRepository } from '@modules/order/domain/repositories/order.repository';
import { UpdateOrderStatusRequest } from '@modules/order/application/contracts/requests/update-order-status.request';
import { UpdateOrderStatusResponse } from '@modules/order/application/contracts/responses/update-order-status.response';
import { UseCase } from '@shared/application/usecase.interface';
import type { OutputPort } from '@shared/application/contracts/output-port.interface';

export class UpdateOrderStatusUseCase
  implements UseCase<UpdateOrderStatusRequest>
{
  constructor(
    private readonly outputPort: OutputPort<UpdateOrderStatusResponse>,
    @Inject(ORDER_REPOSITORY) private readonly orders: OrderRepository,
  ) {}

  async execute(input: UpdateOrderStatusRequest): Promise<void> {
    const success = await this.orders.updateOrderStatus(input.id, input.status);
    this.outputPort.present({ success });
  }
}
