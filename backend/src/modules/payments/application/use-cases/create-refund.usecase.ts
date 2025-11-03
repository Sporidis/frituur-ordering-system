import { Inject, Injectable } from '@nestjs/common';
import {
  PAYMENT_REPOSITORY,
  type IPaymentRepository,
} from '@modules/payments/domain/payment-repository.interface';
import {
  PAYMENT_GATEWAY,
  type PaymentGatewayPort,
} from '@modules/payments/domain/ports/payment-gateway.port';

@Injectable()
export class CreateRefundUseCase {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: IPaymentRepository,
    @Inject(PAYMENT_GATEWAY)
    private readonly paymentGateway: PaymentGatewayPort,
  ) {}

  async execute(paymentIntentId: string, amount?: number, reason?: string) {
    const payments = await this.paymentRepository.findAll();
    const payment = payments.find(
      (p) => p.stripePaymentIntentId === paymentIntentId,
    );
    if (!payment) {
      throw new Error('Payment not found');
    }
    if (!payment.canBeRefunded()) {
      throw new Error(
        `Payment cannot be refunded. Current status: ${payment.status}`,
      );
    }

    const res = await this.paymentGateway.createRefund(
      paymentIntentId,
      amount,
      reason,
    );
    return { refundId: res.refundId, status: res.status };
  }
}
