import { Injectable } from '@nestjs/common';
import { PaymentPresenters } from '../presenters/payment.presenters';
import { Endpoint } from '../../../../../shared/presentation/http/endpoint.interface';
import { CreateRefundController } from '../../controllers/create-refund.controller';
import { CreateRefundRequest } from '../../contracts/requests/create-refund.request';

@Injectable()
export class CreateRefundEndpoint implements Endpoint {
  constructor(private readonly controller: CreateRefundController) {}

  async handle(body: CreateRefundRequest) {
    const result = await this.controller.handle(body);
    return PaymentPresenters.refundCreated({
      refundId: result.refundId,
      status: result.status,
      amount: body.amount,
      paymentIntentId: body.paymentIntentId,
    });
  }
}
