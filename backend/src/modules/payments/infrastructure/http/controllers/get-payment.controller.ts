import { Injectable } from '@nestjs/common';
import type { UseCase } from '@shared/application/usecase.interface';
import { GetPaymentRequest } from '@modules/payments/application/use-cases/get-payment.usecase';

export interface GetPaymentControllerRequest {
  id: string;
}

@Injectable()
export class GetPaymentController {
  constructor(private readonly useCase: UseCase<GetPaymentRequest>) {}

  async handle(request: GetPaymentControllerRequest): Promise<void> {
    await this.useCase.execute({ id: request.id });
  }
}
