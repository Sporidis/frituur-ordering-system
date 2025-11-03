import { Injectable } from '@nestjs/common';
import { GetPaymentUseCase } from '../../../application/use-cases/get-payment.usecase';
import { PaymentPresenters } from '../presenters/payment.presenters';
import { Endpoint } from '../../../../../shared/presentation/http/endpoint.interface';

@Injectable()
export class GetPaymentIntentEndpoint implements Endpoint {
  constructor(private readonly useCase: GetPaymentUseCase) {}

  async handle(id: string) {
    const payment = await this.useCase.execute(id);
    if (!payment) {
      return PaymentPresenters.error('Payment not found');
    }
    return PaymentPresenters.paymentIntent({
      id: payment.id,
      amount: payment.amount.amount,
      currency: payment.amount.currency,
      status: payment.status,
      metadata: payment.metadata,
    });
  }
}
