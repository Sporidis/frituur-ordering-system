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

export interface SyncStatusRequest {
  paymentIntentId: string;
}

export interface SyncStatusResponse {
  paymentId: string;
  status: string;
}

export class SyncStatusUseCase implements UseCase<SyncStatusRequest> {
  constructor(
    private readonly outputPort: OutputPort<SyncStatusResponse>,
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: IPaymentRepository,
    @Inject(PAYMENT_GATEWAY)
    private readonly paymentGateway: PaymentGatewayPort,
  ) {}

  async execute(input: SyncStatusRequest): Promise<void> {
    const payments = await this.paymentRepository.findAll();
    const payment = payments.find(
      (p) => p.stripePaymentIntentId === input.paymentIntentId,
    );
    if (!payment) {
      throw new NotFoundException('Payment', input.paymentIntentId);
    }

    const intent = await this.paymentGateway.getPaymentIntent(
      input.paymentIntentId,
    );
    const status = intent.status;

    // Business logic in domain entity
    if (status === 'succeeded') {
      payment.markAsSucceeded(intent.id);
    } else if (status === 'canceled') {
      payment.markAsCancelled();
    } else if (status === 'requires_payment_method') {
      payment.markAsFailed('requires_payment_method');
    }

    await this.paymentRepository.save(payment);
    this.outputPort.present({
      paymentId: payment.id,
      status: payment.status,
    });
  }
}
