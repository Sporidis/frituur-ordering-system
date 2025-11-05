import { Injectable } from '@nestjs/common';
import type { UseCase } from '@shared/application/usecase.interface';
import { CreateRefundRequest } from '@modules/payments/application/use-cases/create-refund.usecase';

export interface CreateRefundControllerRequest {
  paymentIntentId: string;
  amount?: number;
  reason?: string;
}

@Injectable()
export class CreateRefundController {
  constructor(private readonly useCase: UseCase<CreateRefundRequest>) {}

  async handle(request: CreateRefundControllerRequest): Promise<void> {
    await this.useCase.execute({
      paymentIntentId: request.paymentIntentId,
      amount: request.amount,
      reason: request.reason,
    });
  }
}
