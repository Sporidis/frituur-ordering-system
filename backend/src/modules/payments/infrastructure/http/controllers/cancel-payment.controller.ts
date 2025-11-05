import { Injectable } from '@nestjs/common';
import type { UseCase } from '@shared/application/usecase.interface';
import { CancelPaymentRequest } from '@modules/payments/application/use-cases/cancel-payment.usecase';

export interface CancelPaymentControllerRequest {
  paymentId: string;
}

@Injectable()
export class CancelPaymentController {
  constructor(private readonly useCase: UseCase<CancelPaymentRequest>) {}

  async handle(request: CancelPaymentControllerRequest): Promise<void> {
    await this.useCase.execute({ paymentId: request.paymentId });
  }
}
