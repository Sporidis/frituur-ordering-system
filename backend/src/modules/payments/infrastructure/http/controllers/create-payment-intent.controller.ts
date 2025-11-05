import { Injectable } from '@nestjs/common';
import type { UseCase } from '@shared/application/usecase.interface';
import { CreatePaymentIntentRequest } from '@modules/payments/application/use-cases/create-payment-intent.usecase';

export interface CreatePaymentIntentControllerRequest {
  amount: number;
  currency: string;
  customerId?: string;
  orderId?: string;
  paymentMethod?: string;
  metadata?: Record<string, any>;
}

@Injectable()
export class CreatePaymentIntentController {
  constructor(private readonly useCase: UseCase<CreatePaymentIntentRequest>) {}

  async handle(request: CreatePaymentIntentControllerRequest): Promise<void> {
    await this.useCase.execute({
      amount: request.amount,
      currency: request.currency,
      customerId: request.customerId,
      orderId: request.orderId,
      paymentMethod: request.paymentMethod,
      metadata: request.metadata,
    });
  }
}
