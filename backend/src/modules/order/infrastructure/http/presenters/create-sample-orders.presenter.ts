import type { OutputPort } from '@shared/application/contracts/output-port.interface';
import type { RequestResponseDevice } from '@shared/infrastructure/devices/request-response.device';
import type { CreateSampleOrdersResponse } from '@modules/order/application/contracts/responses/create-sample-orders.response';

export interface CreateSampleOrdersHttpResponse {
  success: true;
  message: string;
}

export class CreateSampleOrdersPresenter
  implements OutputPort<CreateSampleOrdersResponse>
{
  constructor(
    private readonly device: RequestResponseDevice<CreateSampleOrdersHttpResponse>,
  ) {}

  present(output: CreateSampleOrdersResponse): void {
    const presentedData: CreateSampleOrdersHttpResponse = {
      success: true,
      message: output.message,
    };
    this.device.update(presentedData);
  }
}
