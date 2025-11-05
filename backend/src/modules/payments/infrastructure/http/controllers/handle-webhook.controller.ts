import { Injectable } from '@nestjs/common';
import type { UseCase } from '@shared/application/usecase.interface';
import { HandleWebhookRequest } from '@modules/payments/application/use-cases/handle-webhook.usecase';

export interface HandleWebhookControllerRequest {
  rawBody: Buffer;
  signature: string;
}

@Injectable()
export class HandleWebhookController {
  constructor(private readonly useCase: UseCase<HandleWebhookRequest>) {}

  async handle(request: HandleWebhookControllerRequest): Promise<void> {
    await this.useCase.execute({
      rawBody: request.rawBody,
      signature: request.signature,
    });
  }
}
