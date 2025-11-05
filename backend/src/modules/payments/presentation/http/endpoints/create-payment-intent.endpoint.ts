import { Injectable, Inject } from '@nestjs/common';
import { Endpoint } from '@shared/presentation/http/endpoint.interface';
import { I18nService } from '@modules/i18n/application/i18n.service';
import { RequestResponse } from '@shared/infrastructure/devices/request-response.device';
import { CreatePaymentIntentUseCase } from '@modules/payments/application/use-cases/create-payment-intent.usecase';
import { CreatePaymentIntentController } from '@modules/payments/infrastructure/http/controllers/create-payment-intent.controller';
import {
  CreatePaymentIntentPresenter,
  CreatePaymentIntentHttpResponse,
} from '@modules/payments/infrastructure/http/presenters/create-payment-intent.presenter';
import { PAYMENT_REPOSITORY } from '@modules/payments/domain/payment-repository.interface';
import type { IPaymentRepository } from '@modules/payments/domain/payment-repository.interface';
import {
  PAYMENT_GATEWAY,
  type PaymentGatewayPort,
} from '@modules/payments/domain/ports/payment-gateway.port';
import { CreatePaymentIntentRequest } from '@modules/payments/application/use-cases/create-payment-intent.usecase';
import { PaymentPresenters } from '../presenters/payment.presenters';

@Injectable()
export class CreatePaymentIntentEndpoint implements Endpoint {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: IPaymentRepository,
    @Inject(PAYMENT_GATEWAY)
    private readonly paymentGateway: PaymentGatewayPort,
    private readonly i18n: I18nService,
  ) {}

  async handle(dto: CreatePaymentIntentRequest & { locale: string }) {
    const device = new RequestResponse<CreatePaymentIntentHttpResponse>();
    const presenter = new CreatePaymentIntentPresenter(device);
    const useCase = new CreatePaymentIntentUseCase(
      presenter,
      this.paymentRepository,
      this.paymentGateway,
    );
    const controller = new CreatePaymentIntentController(useCase);

    await controller.handle({
      amount: dto.amount,
      currency: dto.currency,
      customerId: dto.customerId,
      orderId: dto.orderId,
      paymentMethod: dto.paymentMethod,
      metadata: dto.metadata,
    });

    const response = device.response;
    if (!response) {
      throw new Error('No response captured from use case');
    }

    const message = this.i18n.translate(
      'payment_intent_created',
      { id: response.paymentIntentId },
      dto.locale,
    );

    return PaymentPresenters.createdIntent({
      paymentIntentId: response.paymentIntentId,
      clientSecret: response.clientSecret,
      amount: dto.amount,
      currency: dto.currency,
      message,
    });
  }
}
