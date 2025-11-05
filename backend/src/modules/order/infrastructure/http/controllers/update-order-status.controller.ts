import { Injectable } from '@nestjs/common';
import type { UseCase } from '@shared/application/usecase.interface';
import { UpdateOrderStatusRequest } from '@modules/order/application/contracts/requests/update-order-status.request';
import { OrderStatus } from '@modules/order/domain';

export interface UpdateOrderStatusControllerRequest {
  id: string;
  status: OrderStatus;
}

@Injectable()
export class UpdateOrderStatusController {
  constructor(private readonly useCase: UseCase<UpdateOrderStatusRequest>) {}

  async handle(request: UpdateOrderStatusControllerRequest): Promise<void> {
    const useCaseInput = this.mapToUseCaseInput(request);
    await this.useCase.execute(useCaseInput);
  }

  private mapToUseCaseInput(
    request: UpdateOrderStatusControllerRequest,
  ): UpdateOrderStatusRequest {
    return { id: request.id, status: request.status };
  }
}
