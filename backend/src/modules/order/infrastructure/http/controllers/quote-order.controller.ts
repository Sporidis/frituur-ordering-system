import { Injectable } from '@nestjs/common';
import type { UseCase } from '@shared/application/usecase.interface';
import { QuoteOrderRequest } from '@modules/order/application/contracts/requests/quote-order.request';

export interface QuoteOrderControllerRequest {
  items: Array<{ name: string; price: number; quantity: number }>;
}

@Injectable()
export class QuoteOrderController {
  constructor(private readonly useCase: UseCase<QuoteOrderRequest>) {}

  async handle(request: QuoteOrderControllerRequest): Promise<void> {
    const useCaseInput = this.mapToUseCaseInput(request);
    await this.useCase.execute(useCaseInput);
  }

  private mapToUseCaseInput(
    request: QuoteOrderControllerRequest,
  ): QuoteOrderRequest {
    return { items: request.items };
  }
}
