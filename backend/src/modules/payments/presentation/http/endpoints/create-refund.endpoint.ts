import { Injectable } from '@nestjs/common';
import { PaymentPresenters } from '../presenters/payment.presenters';
import { Endpoint } from '../../../../../shared/presentation/http/endpoint.interface';
import { CreateRefundController } from '../../controllers/create-refund.controller';
import { CreateRefundRequest } from '../../contracts/requests/create-refund.request';
import { I18nService } from '@modules/i18n/application/i18n.service';

@Injectable()
export class CreateRefundEndpoint implements Endpoint {
  constructor(
    private readonly controller: CreateRefundController,
    private readonly i18n: I18nService,
  ) {}

  async handle(body: CreateRefundRequest & { locale: string }) {
    const result = await this.controller.handle(body);
    const message = this.i18n.translate(
      'refund_created_success',
      { id: result.refundId },
      body.locale,
    );
    return PaymentPresenters.refundCreated({
      refundId: result.refundId,
      status: result.status,
      amount: body.amount,
      paymentIntentId: body.paymentIntentId,
      message,
    });
  }
}
