import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '@shared/application/usecase.interface';
import {
  PAYMENT_REPOSITORY,
  type IPaymentRepository,
} from '@modules/payments/domain/payment-repository.interface';
import {
  PAYMENT_GATEWAY,
  type PaymentGatewayPort,
} from '@modules/payments/domain/ports/payment-gateway.port';

@Injectable()
export class CancelPaymentUseCase implements UseCase<string, void> {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: IPaymentRepository,
    @Inject(PAYMENT_GATEWAY)
    private readonly paymentGateway: PaymentGatewayPort,
  ) {}

  async execute(paymentId: string): Promise<void> {
    const payment = await this.paymentRepository.findById(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    if (payment.stripePaymentIntentId) {
      await this.paymentGateway.cancelPaymentIntent(
        payment.stripePaymentIntentId,
      );
    }

    // Business logic in domain entity
    payment.markAsCancelled();
    await this.paymentRepository.save(payment);
  }
}
