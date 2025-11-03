import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../../shared/application/usecase.interface';
import {
  PAYMENT_REPOSITORY,
  type IPaymentRepository,
} from '@modules/payments/domain/payment-repository.interface';
import {
  PAYMENT_GATEWAY,
  type PaymentGatewayPort,
} from '@modules/payments/domain/ports/payment-gateway.port';

@Injectable()
export class SyncStatusUseCase implements UseCase<string, any> {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: IPaymentRepository,
    @Inject(PAYMENT_GATEWAY)
    private readonly paymentGateway: PaymentGatewayPort,
  ) {}

  async execute(paymentIntentId: string) {
    const payments = await this.paymentRepository.findAll();
    const payment = payments.find(
      (p) => p.stripePaymentIntentId === paymentIntentId,
    );
    if (!payment) {
      throw new Error('Payment not found');
    }

    const intent = await this.paymentGateway.getPaymentIntent(paymentIntentId);
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
    return { paymentId: payment.id, status: payment.status };
  }
}
