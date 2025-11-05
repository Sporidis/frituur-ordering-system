import { Inject } from '@nestjs/common';
import { UseCase } from '@shared/application/usecase.interface';
import type { OutputPort } from '@shared/application/contracts/output-port.interface';
import {
  PAYMENT_REPOSITORY,
  type IPaymentRepository,
} from '@modules/payments/domain/payment-repository.interface';
import type { Payment } from '@modules/payments/domain/payment.entity';

export interface GetPaymentRequest {
  id: string;
}

export interface GetPaymentResponse {
  payment: Payment | null;
}

export class GetPaymentUseCase implements UseCase<GetPaymentRequest> {
  constructor(
    private readonly outputPort: OutputPort<GetPaymentResponse>,
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: IPaymentRepository,
  ) {}

  async execute(input: GetPaymentRequest): Promise<void> {
    const payment = await this.paymentRepository.findById(input.id);
    this.outputPort.present({ payment });
  }
}
