import type { OutputPort } from '@shared/application/contracts/output-port.interface';
import type { RequestResponseDevice } from '@shared/infrastructure/devices/request-response.device';
import type { ProcessPaymentResponse } from '@modules/payments/application/use-cases/process-payment.usecase';

export interface ProcessPaymentHttpResponse {
  success: true;
  paymentId: string;
  status: string;
  amount: number;
  currency: string;
}

export class ProcessPaymentPresenter
  implements OutputPort<ProcessPaymentResponse>
{
  constructor(
    private readonly device: RequestResponseDevice<ProcessPaymentHttpResponse>,
  ) {}

  present(output: ProcessPaymentResponse): void {
    const presentedData: ProcessPaymentHttpResponse = {
      success: true,
      paymentId: output.paymentId,
      status: output.status,
      amount: output.amount,
      currency: output.currency,
    };
    this.device.update(presentedData);
  }
}
