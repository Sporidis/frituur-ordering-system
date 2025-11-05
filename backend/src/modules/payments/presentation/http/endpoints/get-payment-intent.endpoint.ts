import { Injectable, Inject } from '@nestjs/common';
import { Endpoint } from '@shared/presentation/http/endpoint.interface';
import { RequestResponse } from '@shared/infrastructure/devices/request-response.device';
import { GetPaymentUseCase } from '@modules/payments/application/use-cases/get-payment.usecase';
import { GetPaymentController } from '@modules/payments/infrastructure/http/controllers/get-payment.controller';
import {
  GetPaymentPresenter,
  GetPaymentHttpResponse,
} from '@modules/payments/infrastructure/http/presenters/get-payment.presenter';
import { PAYMENT_REPOSITORY } from '@modules/payments/domain/payment-repository.interface';
import type { IPaymentRepository } from '@modules/payments/domain/payment-repository.interface';
import { PaymentPresenters } from '../presenters/payment.presenters';

@Injectable()
export class GetPaymentIntentEndpoint implements Endpoint {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: IPaymentRepository,
  ) {}

  async handle(id: string) {
    const device = new RequestResponse<GetPaymentHttpResponse>();
    const presenter = new GetPaymentPresenter(device);
    const useCase = new GetPaymentUseCase(presenter, this.paymentRepository);
    const controller = new GetPaymentController(useCase);

    await controller.handle({ id });

    const response = device.response;
    if (!response || !response.payment) {
      return PaymentPresenters.error('Payment not found');
    }

    return PaymentPresenters.paymentIntent({
      id: response.payment.id,
      amount: response.payment.amount.amount,
      currency: response.payment.amount.currency,
      status: response.payment.status,
      metadata: response.payment.metadata,
    });
  }
}
