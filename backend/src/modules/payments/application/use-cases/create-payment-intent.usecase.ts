import { Inject } from '@nestjs/common';
import { UseCase } from '@shared/application/usecase.interface';
import type { OutputPort } from '@shared/application/contracts/output-port.interface';
import { Money } from '@shared/domain/value-objects/money';
import { Payment } from '@modules/payments/domain/payment.entity';
import { PaymentMethod } from '@modules/payments/domain/payment-method.enum';
import {
  PAYMENT_REPOSITORY,
  type IPaymentRepository,
} from '@modules/payments/domain/payment-repository.interface';
import {
  PAYMENT_GATEWAY,
  type PaymentGatewayPort,
} from '@modules/payments/domain/ports/payment-gateway.port';

export interface CreatePaymentIntentRequest {
  amount: number;
  currency: string;
  customerId?: string;
  orderId?: string;
  paymentMethod?: string;
  metadata?: Record<string, any>;
}

export interface CreatePaymentIntentResponse {
  paymentId: string;
  paymentIntentId: string;
  clientSecret: string;
}

export class CreatePaymentIntentUseCase
  implements UseCase<CreatePaymentIntentRequest>
{
  constructor(
    private readonly outputPort: OutputPort<CreatePaymentIntentResponse>,
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: IPaymentRepository,
    @Inject(PAYMENT_GATEWAY)
    private readonly paymentGateway: PaymentGatewayPort,
  ) {}

  async execute(input: CreatePaymentIntentRequest): Promise<void> {
    const amount = new Money(input.amount, input.currency);
    const paymentMethod = (input.paymentMethod as PaymentMethod) || 'card';
    const payment = new Payment(
      amount,
      input.customerId || 'anonymous',
      input.orderId || 'unknown-order',
      paymentMethod,
    );

    if (input.metadata) {
      payment.updateMetadata(input.metadata);
    }

    const stripe = await this.paymentGateway.createPaymentIntent(
      amount,
      input.customerId || 'anonymous',
      input.orderId || 'unknown-order',
      input.metadata,
    );

    payment.markAsProcessing(stripe.paymentIntentId);
    await this.paymentRepository.save(payment);

    this.outputPort.present({
      paymentId: payment.id,
      paymentIntentId: stripe.paymentIntentId,
      clientSecret: stripe.clientSecret,
    });
  }
}
