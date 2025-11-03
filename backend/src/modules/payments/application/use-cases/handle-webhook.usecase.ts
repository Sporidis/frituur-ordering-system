import { Injectable } from '@nestjs/common';
import { PaymentApplicationService } from '../payment-application.service';
import { UseCase } from '../../../../shared/application/usecase.interface';

@Injectable()
export class HandleWebhookUseCase
  implements UseCase<{ rawBody: Buffer; signature: string }, any>
{
  constructor(private readonly app: PaymentApplicationService) {}

  execute(input: { rawBody: Buffer; signature: string }) {
    return this.app.handleWebhook(input.rawBody, input.signature);
  }
}
