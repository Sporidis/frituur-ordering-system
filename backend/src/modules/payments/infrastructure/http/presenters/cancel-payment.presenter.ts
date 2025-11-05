import type { OutputPort } from '@shared/application/contracts/output-port.interface';
import type { RequestResponseDevice } from '@shared/infrastructure/devices/request-response.device';
import type { CancelPaymentResponse } from '@modules/payments/application/use-cases/cancel-payment.usecase';

export interface CancelPaymentHttpResponse {
  success: true;
  message: string;
}

export class CancelPaymentPresenter
  implements OutputPort<CancelPaymentResponse>
{
  constructor(
    private readonly device: RequestResponseDevice<CancelPaymentHttpResponse>,
  ) {}

  present(output: CancelPaymentResponse): void {
    const presentedData: CancelPaymentHttpResponse = {
      success: true,
      message: '', // Will be set by endpoint
    };
    this.device.update(presentedData);
  }
}
