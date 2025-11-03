import { Injectable } from '@nestjs/common';
import { PaymentPresenters } from '../presenters/payment.presenters';
import { Endpoint } from '../../../../../shared/presentation/http/endpoint.interface';
import { CreatePaymentIntentController } from '../../controllers/create-payment-intent.controller';
import { CreatePaymentIntentRequest } from '../../contracts/requests/create-payment-intent.request';

@Injectable()
export class CreatePaymentIntentEndpoint implements Endpoint {
  constructor(private readonly controller: CreatePaymentIntentController) {}

  async handle(dto: CreatePaymentIntentRequest) {
    const result = await this.controller.handle(dto);
    return PaymentPresenters.createdIntent({
      paymentIntentId: result.paymentIntentId,
      clientSecret: result.clientSecret,
      amount: dto.amount,
      currency: dto.currency,
    });
  }
}
