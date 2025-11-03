import { Injectable } from '@nestjs/common';
import { Controller } from '../../../../shared/presentation/contracts/controller.interface';
import { CreatePaymentIntentRequest } from '../contracts/requests/create-payment-intent.request';
import { CreatePaymentIntentResponse } from '../contracts/responses/create-payment-intent.response';
import { CreatePaymentIntentUseCase } from '../../application/use-cases/create-payment-intent.usecase';
import { CreatePaymentIntentDto } from '../dto/create-payment-intent.dto';

@Injectable()
export class CreatePaymentIntentController
  implements Controller<CreatePaymentIntentRequest, CreatePaymentIntentResponse>
{
  constructor(private readonly useCase: CreatePaymentIntentUseCase) {}

  async handle(
    request: CreatePaymentIntentRequest,
  ): Promise<CreatePaymentIntentResponse> {
    const dto: CreatePaymentIntentDto = {
      amount: request.amount,
      currency: request.currency,
      customerId: request.customerId ?? 'anonymous',
      orderId: request.orderId ?? 'unknown-order',
      paymentMethod: request.paymentMethod ?? 'card',
      metadata: request.metadata,
    };
    const result = await this.useCase.execute(dto);
    return {
      paymentId: result.paymentId,
      paymentIntentId: result.paymentIntentId,
      clientSecret: result.clientSecret,
    };
  }
}
