import { Injectable } from '@nestjs/common';
import { ProcessPaymentUseCase } from '../../../application/use-cases/process-payment.usecase';
import { ProcessPaymentDto } from '../../dto/process-payment.dto';
import { PaymentPresenters } from '../presenters/payment.presenters';
import { Endpoint } from '../../../../../shared/presentation/http/endpoint.interface';

@Injectable()
export class ProcessPaymentEndpoint implements Endpoint {
  constructor(private readonly useCase: ProcessPaymentUseCase) {}

  async handle(dto: ProcessPaymentDto) {
    const result = await this.useCase.execute(dto);
    return PaymentPresenters.processedPayment({
      paymentId: result.paymentId,
      status: result.status,
      amount: result.amount,
      currency: result.currency,
    });
  }
}
