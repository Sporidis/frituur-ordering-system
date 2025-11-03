import { Injectable } from '@nestjs/common';
import { HandleWebhookUseCase } from '../../../application/use-cases/handle-webhook.usecase';
import { Endpoint } from '../../../../../shared/presentation/http/endpoint.interface';

@Injectable()
export class HandleWebhookEndpoint implements Endpoint {
  constructor(private readonly useCase: HandleWebhookUseCase) {}

  async handle(rawBody: Buffer, signature: string) {
    const result = await this.useCase.execute({ rawBody, signature });
    return {
      success: true,
      message: 'Webhook processed successfully',
      event: result.eventType,
    };
  }
}
