import { Injectable, Inject } from '@nestjs/common';
import { Endpoint } from '@shared/presentation/http/endpoint.interface';
import { RequestResponse } from '@shared/infrastructure/devices/request-response.device';
import { HandleWebhookUseCase } from '@modules/payments/application/use-cases/handle-webhook.usecase';
import { HandleWebhookController } from '@modules/payments/infrastructure/http/controllers/handle-webhook.controller';
import {
  HandleWebhookPresenter,
  HandleWebhookHttpResponse,
} from '@modules/payments/infrastructure/http/presenters/handle-webhook.presenter';
import { PAYMENT_REPOSITORY } from '@modules/payments/domain/payment-repository.interface';
import type { IPaymentRepository } from '@modules/payments/domain/payment-repository.interface';
import {
  PAYMENT_GATEWAY,
  type PaymentGatewayPort,
} from '@modules/payments/domain/ports/payment-gateway.port';

@Injectable()
export class HandleWebhookEndpoint implements Endpoint {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: IPaymentRepository,
    @Inject(PAYMENT_GATEWAY)
    private readonly paymentGateway: PaymentGatewayPort,
  ) {}

  async handle(rawBody: Buffer, signature: string) {
    const device = new RequestResponse<HandleWebhookHttpResponse>();
    const presenter = new HandleWebhookPresenter(device);
    const useCase = new HandleWebhookUseCase(
      presenter,
      this.paymentRepository,
      this.paymentGateway,
    );
    const controller = new HandleWebhookController(useCase);

    await controller.handle({ rawBody, signature });

    const response = device.response;
    if (!response) {
      throw new Error('No response captured from use case');
    }

    return {
      success: true,
      message: 'Webhook processed successfully',
      event: response.eventType,
    };
  }
}
