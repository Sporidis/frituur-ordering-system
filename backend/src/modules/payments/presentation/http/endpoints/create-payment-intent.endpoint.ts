import { Injectable } from '@nestjs/common';
import { PaymentPresenters } from '../presenters/payment.presenters';
import { Endpoint } from '../../../../../shared/presentation/http/endpoint.interface';
import { CreatePaymentIntentController } from '../../controllers/create-payment-intent.controller';
import { CreatePaymentIntentRequest } from '../../contracts/requests/create-payment-intent.request';
import { I18nService } from '@modules/i18n/application/i18n.service';

@Injectable()
export class CreatePaymentIntentEndpoint implements Endpoint {
  constructor(
    private readonly controller: CreatePaymentIntentController,
    private readonly i18n: I18nService,
  ) {}

  async handle(dto: CreatePaymentIntentRequest & { locale: string }) {
    const result = await this.controller.handle(dto);
    const message = this.i18n.translate(
      'payment_intent_created',
      { id: result.paymentIntentId },
      dto.locale,
    );
    return PaymentPresenters.createdIntent({
      paymentIntentId: result.paymentIntentId,
      clientSecret: result.clientSecret,
      amount: dto.amount,
      currency: dto.currency,
      message,
    });
  }
}
