import type { OutputPort } from '@shared/application/contracts/output-port.interface';
import type { RequestResponseDevice } from '@shared/infrastructure/devices/request-response.device';
import type { HandleWebhookResponse } from '@modules/payments/application/use-cases/handle-webhook.usecase';

export interface HandleWebhookHttpResponse {
  success: true;
  eventType: string;
  processed: boolean;
}

export class HandleWebhookPresenter
  implements OutputPort<HandleWebhookResponse>
{
  constructor(
    private readonly device: RequestResponseDevice<HandleWebhookHttpResponse>,
  ) {}

  present(output: HandleWebhookResponse): void {
    const presentedData: HandleWebhookHttpResponse = {
      success: true,
      eventType: output.eventType,
      processed: output.processed,
    };
    this.device.update(presentedData);
  }
}
