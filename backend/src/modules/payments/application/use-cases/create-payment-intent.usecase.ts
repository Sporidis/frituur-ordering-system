import { Inject, Injectable } from '@nestjs/common';
import { CreatePaymentIntentDto } from '../../presentation/dto/create-payment-intent.dto';
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

@Injectable()
export class CreatePaymentIntentUseCase {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: IPaymentRepository,
    @Inject(PAYMENT_GATEWAY)
    private readonly paymentGateway: PaymentGatewayPort,
  ) {}

  async execute(dto: CreatePaymentIntentDto) {
    const amount = new Money(dto.amount, dto.currency);
    const paymentMethod = dto.paymentMethod as PaymentMethod;
    const payment = new Payment(
      amount,
      dto.customerId,
      dto.orderId,
      paymentMethod,
    );

    if (dto.metadata) {
      payment.updateMetadata(dto.metadata);
    }

    const stripe = await this.paymentGateway.createPaymentIntent(
      amount,
      dto.customerId,
      dto.orderId,
      dto.metadata,
    );

    payment.markAsProcessing(stripe.paymentIntentId);
    await this.paymentRepository.save(payment);

    return {
      paymentId: payment.id,
      paymentIntentId: stripe.paymentIntentId,
      clientSecret: stripe.clientSecret,
    };
  }
}
