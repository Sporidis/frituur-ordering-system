import { Injectable } from '@nestjs/common';
import { Controller } from '../../../../shared/presentation/contracts/controller.interface';
import { CreateRefundRequest } from '../contracts/requests/create-refund.request';
import { CreateRefundResponse } from '../contracts/responses/create-refund.response';
import { CreateRefundUseCase } from '../../application/use-cases/create-refund.usecase';

@Injectable()
export class CreateRefundController
  implements Controller<CreateRefundRequest, CreateRefundResponse>
{
  constructor(private readonly useCase: CreateRefundUseCase) {}

  async handle(request: CreateRefundRequest): Promise<CreateRefundResponse> {
    const result = await this.useCase.execute(
      request.paymentIntentId,
      request.amount,
      request.reason,
    );
    return { refundId: result.refundId, status: result.status };
  }
}
