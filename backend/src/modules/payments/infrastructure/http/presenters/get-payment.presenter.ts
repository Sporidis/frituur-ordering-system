import type { OutputPort } from '@shared/application/contracts/output-port.interface';
import type { RequestResponseDevice } from '@shared/infrastructure/devices/request-response.device';
import type { GetPaymentResponse } from '@modules/payments/application/use-cases/get-payment.usecase';
import type { Payment } from '@modules/payments/domain/payment.entity';

export interface GetPaymentHttpResponse {
  success: true;
  payment: Payment | null;
}

export class GetPaymentPresenter implements OutputPort<GetPaymentResponse> {
  constructor(
    private readonly device: RequestResponseDevice<GetPaymentHttpResponse>,
  ) {}

  present(output: GetPaymentResponse): void {
    const presentedData: GetPaymentHttpResponse = {
      success: true,
      payment: output.payment,
    };
    this.device.update(presentedData);
  }
}
