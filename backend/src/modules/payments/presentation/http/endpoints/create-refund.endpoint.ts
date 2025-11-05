import { Injectable, Inject } from '@nestjs/common';
import { Endpoint } from '@shared/presentation/http/endpoint.interface';
import { I18nService } from '@modules/i18n/application/i18n.service';
import { RequestResponse } from '@shared/infrastructure/devices/request-response.device';
import { CreateRefundUseCase } from '@modules/payments/application/use-cases/create-refund.usecase';
import { CreateRefundController } from '@modules/payments/infrastructure/http/controllers/create-refund.controller';
import {
  CreateRefundPresenter,
  CreateRefundHttpResponse,
} from '@modules/payments/infrastructure/http/presenters/create-refund.presenter';
import { PAYMENT_REPOSITORY } from '@modules/payments/domain/payment-repository.interface';
import type { IPaymentRepository } from '@modules/payments/domain/payment-repository.interface';
import {
  PAYMENT_GATEWAY,
  type PaymentGatewayPort,
} from '@modules/payments/domain/ports/payment-gateway.port';
import { CreateRefundRequest } from '@modules/payments/application/use-cases/create-refund.usecase';
import { PaymentPresenters } from '../presenters/payment.presenters';

@Injectable()
export class CreateRefundEndpoint implements Endpoint {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: IPaymentRepository,
    @Inject(PAYMENT_GATEWAY)
    private readonly paymentGateway: PaymentGatewayPort,
    private readonly i18n: I18nService,
  ) {}

  async handle(body: CreateRefundRequest & { locale: string }) {
    const device = new RequestResponse<CreateRefundHttpResponse>();
    const presenter = new CreateRefundPresenter(device);
    const useCase = new CreateRefundUseCase(
      presenter,
      this.paymentRepository,
      this.paymentGateway,
    );
    const controller = new CreateRefundController(useCase);

    await controller.handle({
      paymentIntentId: body.paymentIntentId,
      amount: body.amount,
      reason: body.reason,
    });

    const response = device.response;
    if (!response) {
      throw new Error('No response captured from use case');
    }

    const message = this.i18n.translate(
      'refund_created_success',
      { id: response.refundId },
      body.locale,
    );

    return PaymentPresenters.refundCreated({
      refundId: response.refundId,
      status: response.status,
      amount: body.amount,
      paymentIntentId: body.paymentIntentId,
      message,
    });
  }
}
