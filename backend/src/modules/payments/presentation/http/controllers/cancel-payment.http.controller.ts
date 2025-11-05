import { Controller, Param, Post, Inject } from '@nestjs/common';
import { RequestResponse } from '@shared/infrastructure/devices/request-response.device';
import { CancelPaymentUseCase } from '@modules/payments/application/use-cases/cancel-payment.usecase';
import { CancelPaymentController } from '@modules/payments/infrastructure/http/controllers/cancel-payment.controller';
import {
  CancelPaymentPresenter,
  CancelPaymentHttpResponse,
} from '@modules/payments/infrastructure/http/presenters/cancel-payment.presenter';
import { PAYMENT_REPOSITORY } from '@modules/payments/domain/payment-repository.interface';
import type { IPaymentRepository } from '@modules/payments/domain/payment-repository.interface';
import {
  PAYMENT_GATEWAY,
  type PaymentGatewayPort,
} from '@modules/payments/domain/ports/payment-gateway.port';

@Controller('payments')
export class CancelPaymentHttpController {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: IPaymentRepository,
    @Inject(PAYMENT_GATEWAY)
    private readonly paymentGateway: PaymentGatewayPort,
  ) {}

  @Post('cancel/:id')
  async handle(@Param('id') id: string) {
    const device = new RequestResponse<CancelPaymentHttpResponse>();
    const presenter = new CancelPaymentPresenter(device);
    const useCase = new CancelPaymentUseCase(
      presenter,
      this.paymentRepository,
      this.paymentGateway,
    );
    const controller = new CancelPaymentController(useCase);

    await controller.handle({ paymentId: id });

    return { success: true, message: 'Payment cancelled successfully' };
  }
}
