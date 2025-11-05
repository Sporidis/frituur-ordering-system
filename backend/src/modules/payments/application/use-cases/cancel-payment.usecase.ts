import { Inject } from '@nestjs/common';
import { UseCase } from '@shared/application/usecase.interface';
import type { OutputPort } from '@shared/application/contracts/output-port.interface';
import { NotFoundException } from '@shared/application/exceptions/base.exception';
import {
  PAYMENT_REPOSITORY,
  type IPaymentRepository,
} from '@modules/payments/domain/payment-repository.interface';
import {
  PAYMENT_GATEWAY,
  type PaymentGatewayPort,
} from '@modules/payments/domain/ports/payment-gateway.port';

export interface CancelPaymentRequest {
  paymentId: string;
}

export interface CancelPaymentResponse {
  success: boolean;
}

export class CancelPaymentUseCase implements UseCase<CancelPaymentRequest> {
  constructor(
    private readonly outputPort: OutputPort<CancelPaymentResponse>,
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: IPaymentRepository,
    @Inject(PAYMENT_GATEWAY)
    private readonly paymentGateway: PaymentGatewayPort,
  ) {}

  async execute(input: CancelPaymentRequest): Promise<void> {
    const payment = await this.paymentRepository.findById(input.paymentId);
    if (!payment) {
      throw new NotFoundException('Payment', input.paymentId);
    }

    if (payment.stripePaymentIntentId) {
      await this.paymentGateway.cancelPaymentIntent(
        payment.stripePaymentIntentId,
      );
    }

    // Business logic in domain entity
    payment.markAsCancelled();
    await this.paymentRepository.save(payment);

    this.outputPort.present({ success: true });
  }
}
