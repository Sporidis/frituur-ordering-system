import type { OutputPort } from '@shared/application/contracts/output-port.interface';
import type { RequestResponseDevice } from '@shared/infrastructure/devices/request-response.device';
import type { CreatePaymentIntentResponse } from '@modules/payments/application/use-cases/create-payment-intent.usecase';

export interface CreatePaymentIntentHttpResponse {
  success: true;
  paymentId: string;
  paymentIntentId: string;
  clientSecret: string;
}

export class CreatePaymentIntentPresenter
  implements OutputPort<CreatePaymentIntentResponse>
{
  constructor(
    private readonly device: RequestResponseDevice<CreatePaymentIntentHttpResponse>,
  ) {}

  present(output: CreatePaymentIntentResponse): void {
    const presentedData: CreatePaymentIntentHttpResponse = {
      success: true,
      paymentId: output.paymentId,
      paymentIntentId: output.paymentIntentId,
      clientSecret: output.clientSecret,
    };
    this.device.update(presentedData);
  }
}
