import type { OutputPort } from '@shared/application/contracts/output-port.interface';
import type { RequestResponseDevice } from '@shared/infrastructure/devices/request-response.device';
import type { CreateRefundResponse } from '@modules/payments/application/use-cases/create-refund.usecase';

export interface CreateRefundHttpResponse {
  success: true;
  refundId: string;
  status: string;
}

export class CreateRefundPresenter implements OutputPort<CreateRefundResponse> {
  constructor(
    private readonly device: RequestResponseDevice<CreateRefundHttpResponse>,
  ) {}

  present(output: CreateRefundResponse): void {
    const presentedData: CreateRefundHttpResponse = {
      success: true,
      refundId: output.refundId,
      status: output.status,
    };
    this.device.update(presentedData);
  }
}
