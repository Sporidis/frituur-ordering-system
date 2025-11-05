import { Injectable, Inject } from '@nestjs/common';
import { Endpoint } from '@shared/presentation/http/endpoint.interface';
import { RequestResponse } from '@shared/infrastructure/devices/request-response.device';
import { ProcessPaymentUseCase } from '@modules/payments/application/use-cases/process-payment.usecase';
import { ProcessPaymentController } from '@modules/payments/infrastructure/http/controllers/process-payment.controller';
import {
  ProcessPaymentPresenter,
  ProcessPaymentHttpResponse,
} from '@modules/payments/infrastructure/http/presenters/process-payment.presenter';
import { PAYMENT_REPOSITORY } from '@modules/payments/domain/payment-repository.interface';
import type { IPaymentRepository } from '@modules/payments/domain/payment-repository.interface';
import {
  PAYMENT_GATEWAY,
  type PaymentGatewayPort,
} from '@modules/payments/domain/ports/payment-gateway.port';
import { ProcessPaymentDto } from '../../dto/process-payment.dto';
import { PaymentPresenters } from '../presenters/payment.presenters';

@Injectable()
export class ProcessPaymentEndpoint implements Endpoint {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: IPaymentRepository,
    @Inject(PAYMENT_GATEWAY)
    private readonly paymentGateway: PaymentGatewayPort,
  ) {}

  async handle(dto: ProcessPaymentDto) {
    const device = new RequestResponse<ProcessPaymentHttpResponse>();
    const presenter = new ProcessPaymentPresenter(device);
    const useCase = new ProcessPaymentUseCase(
      presenter,
      this.paymentRepository,
      this.paymentGateway,
    );
    const controller = new ProcessPaymentController(useCase);

    await controller.handle({
      paymentId: dto.paymentId,
      paymentMethodId: dto.paymentMethodId,
    });

    const response = device.response;
    if (!response) {
      throw new Error('No response captured from use case');
    }

    return PaymentPresenters.processedPayment({
      paymentId: response.paymentId,
      status: response.status,
      amount: response.amount,
      currency: response.currency,
    });
  }
}
