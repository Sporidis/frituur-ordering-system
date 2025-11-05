import { Injectable } from '@nestjs/common';
import type { UseCase } from '@shared/application/usecase.interface';
import { CreateOrderRequest } from '@modules/order/application/contracts/requests/create-order.request';

/**
 * Controller for CreateOrder use case
 * Adapts HTTP concerns to application layer
 * Located in Infrastructure layer (not Presentation) as it's an adapter
 */
export interface CreateOrderControllerRequest {
  customerName: string;
  items: Array<{ name: string; price: number; quantity: number }>;
}

@Injectable()
export class CreateOrderController {
  constructor(private readonly useCase: UseCase<CreateOrderRequest>) {}

  async handle(request: CreateOrderControllerRequest): Promise<void> {
    const useCaseInput = this.mapToUseCaseInput(request);
    await this.useCase.execute(useCaseInput);
  }

  private mapToUseCaseInput(
    request: CreateOrderControllerRequest,
  ): CreateOrderRequest {
    return {
      customerName: request.customerName,
      items: request.items,
    };
  }
}
