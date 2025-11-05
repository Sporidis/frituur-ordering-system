import { Injectable } from '@nestjs/common';
import type { UseCase } from '@shared/application/usecase.interface';
import { GetOrderRequest } from '@modules/order/application/contracts/requests/get-order.request';

export interface GetOrderControllerRequest {
  id: string;
}

@Injectable()
export class GetOrderController {
  constructor(private readonly useCase: UseCase<GetOrderRequest>) {}

  async handle(request: GetOrderControllerRequest): Promise<void> {
    const useCaseInput = this.mapToUseCaseInput(request);
    await this.useCase.execute(useCaseInput);
  }

  private mapToUseCaseInput(
    request: GetOrderControllerRequest,
  ): GetOrderRequest {
    return { id: request.id };
  }
}
