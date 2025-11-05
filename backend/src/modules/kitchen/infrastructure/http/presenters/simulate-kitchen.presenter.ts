import type { OutputPort } from '@shared/application/contracts/output-port.interface';
import type { RequestResponseDevice } from '@shared/infrastructure/devices/request-response.device';
import type { SimulateKitchenResponse } from '@modules/kitchen/application/contracts';

export interface SimulateKitchenHttpResponse {
  success: true;
  message: string;
}

export class SimulateKitchenPresenter
  implements OutputPort<SimulateKitchenResponse>
{
  constructor(
    private readonly device: RequestResponseDevice<SimulateKitchenHttpResponse>,
  ) {}

  present(output: SimulateKitchenResponse): void {
    const presentedData: SimulateKitchenHttpResponse = {
      success: true,
      message: output.message,
    };
    this.device.update(presentedData);
  }
}
