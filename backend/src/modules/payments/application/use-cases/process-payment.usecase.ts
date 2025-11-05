import { Inject } from '@nestjs/common';
import { UseCase } from '@shared/application/usecase.interface';
import type { OutputPort } from '@shared/application/contracts/output-port.interface';
import { NotFoundException } from '@shared/application/exceptions/base.exception';
import { ProcessPaymentDto } from '../../presentation/dto/process-payment.dto';
import {
  PAYMENT_REPOSITORY,
  type IPaymentRepository,
} from '@modules/payments/domain/payment-repository.interface';
import {
  PAYMENT_GATEWAY,
  type PaymentGatewayPort,
} from '@modules/payments/domain/ports/payment-gateway.port';

export interface ProcessPaymentRequest {
  paymentId: string;
  paymentMethodId: string;
}

export interface ProcessPaymentResponse {
  paymentId: string;
  status: string;
  amount: number;
  currency: string;
}

export class ProcessPaymentUseCase implements UseCase<ProcessPaymentRequest> {
  constructor(
    private readonly outputPort: OutputPort<ProcessPaymentResponse>,
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: IPaymentRepository,
    @Inject(PAYMENT_GATEWAY)
    private readonly paymentGateway: PaymentGatewayPort,
  ) {}

  async execute(input: ProcessPaymentRequest): Promise<void> {
    const payments = await this.paymentRepository.findAll();
    const payment = payments.find(
      (p) => p.stripePaymentIntentId === input.paymentId,
    );
    if (!payment) {
      throw new NotFoundException('Payment', input.paymentId);
    }

    const stripeResult = await this.paymentGateway.confirmPaymentIntent(
      payment.stripePaymentIntentId!,
      input.paymentMethodId,
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
    this.outputPort.present({
      paymentId: payment.id,
      status: payment.status,
      amount: payment.amount.amountInCents,
      currency: payment.amount.currency.toLowerCase(),
    });
  }
}
