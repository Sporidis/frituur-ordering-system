import { Injectable, Inject } from '@nestjs/common';
import { Endpoint } from '@shared/presentation/http/endpoint.interface';
import { RequestResponse } from '@shared/infrastructure/devices/request-response.device';
import { SyncStatusUseCase } from '@modules/payments/application/use-cases/sync-status.usecase';
import { SyncStatusController } from '@modules/payments/infrastructure/http/controllers/sync-status.controller';
import {
  SyncStatusPresenter,
  SyncStatusHttpResponse,
} from '@modules/payments/infrastructure/http/presenters/sync-status.presenter';
import { PAYMENT_REPOSITORY } from '@modules/payments/domain/payment-repository.interface';
import type { IPaymentRepository } from '@modules/payments/domain/payment-repository.interface';
import {
  PAYMENT_GATEWAY,
  type PaymentGatewayPort,
} from '@modules/payments/domain/ports/payment-gateway.port';

@Injectable()
export class SyncStatusEndpoint implements Endpoint {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: IPaymentRepository,
    @Inject(PAYMENT_GATEWAY)
    private readonly paymentGateway: PaymentGatewayPort,
  ) {}

  async handle(paymentIntentId: string) {
    const device = new RequestResponse<SyncStatusHttpResponse>();
    const presenter = new SyncStatusPresenter(device);
    const useCase = new SyncStatusUseCase(
      presenter,
      this.paymentRepository,
      this.paymentGateway,
    );
    const controller = new SyncStatusController(useCase);

    await controller.handle({ paymentIntentId });

    const response = device.response;
    if (!response) {
      throw new Error('No response captured from use case');
    }

    return response;
  }
}
