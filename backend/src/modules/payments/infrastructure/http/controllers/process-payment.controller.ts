import { Injectable } from '@nestjs/common';
import type { UseCase } from '@shared/application/usecase.interface';
import { ProcessPaymentRequest } from '@modules/payments/application/use-cases/process-payment.usecase';

export interface ProcessPaymentControllerRequest {
  paymentId: string;
  paymentMethodId: string;
}

@Injectable()
export class ProcessPaymentController {
  constructor(private readonly useCase: UseCase<ProcessPaymentRequest>) {}

  async handle(request: ProcessPaymentControllerRequest): Promise<void> {
    await this.useCase.execute({
      paymentId: request.paymentId,
      paymentMethodId: request.paymentMethodId,
    });
  }
}
