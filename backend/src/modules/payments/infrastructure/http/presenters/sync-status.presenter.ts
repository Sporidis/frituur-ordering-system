import type { OutputPort } from '@shared/application/contracts/output-port.interface';
import type { RequestResponseDevice } from '@shared/infrastructure/devices/request-response.device';
import type { SyncStatusResponse } from '@modules/payments/application/use-cases/sync-status.usecase';

export interface SyncStatusHttpResponse {
  success: true;
  paymentId: string;
  status: string;
}

export class SyncStatusPresenter implements OutputPort<SyncStatusResponse> {
  constructor(
    private readonly device: RequestResponseDevice<SyncStatusHttpResponse>,
  ) {}

  present(output: SyncStatusResponse): void {
    const presentedData: SyncStatusHttpResponse = {
      success: true,
      paymentId: output.paymentId,
      status: output.status,
    };
    this.device.update(presentedData);
  }
}
