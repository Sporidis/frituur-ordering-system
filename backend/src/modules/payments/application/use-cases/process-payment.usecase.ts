import { Inject, Injectable } from '@nestjs/common';
import { ProcessPaymentDto } from '../../presentation/dto/process-payment.dto';
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
export class ProcessPaymentUseCase implements UseCase<ProcessPaymentDto, any> {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: IPaymentRepository,
    @Inject(PAYMENT_GATEWAY)
    private readonly paymentGateway: PaymentGatewayPort,
  ) {}

  async execute(dto: ProcessPaymentDto) {
    const payments = await this.paymentRepository.findAll();
    const payment = payments.find(
      (p) => p.stripePaymentIntentId === dto.paymentId,
    );
    if (!payment) {
      throw new Error('Payment not found');
    }

    const stripeResult = await this.paymentGateway.confirmPaymentIntent(
      payment.stripePaymentIntentId!,
      dto.paymentMethodId,
    );

    if (stripeResult.success && stripeResult.status === 'succeeded') {
      payment.markAsSucceeded(payment.stripePaymentIntentId!);
    } else if (stripeResult.status === 'requires_action') {
      // keep as processing; frontend should handle next actions
    } else {
      payment.markAsFailed(
        `Payment failed with status: ${stripeResult.status}`,
      );
    }

    await this.paymentRepository.save(payment);
    return {
      paymentId: payment.id,
      status: payment.status,
      amount: payment.amount.amountInCents,
      currency: payment.amount.currency.toLowerCase(),
    };
  }
}
