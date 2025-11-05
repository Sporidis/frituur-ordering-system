import type { OutputPort } from '@shared/application/contracts/output-port.interface';
import type { RequestResponseDevice } from '@shared/infrastructure/devices/request-response.device';
import type { UpdateOrderStatusResponse } from '@modules/order/application/contracts/responses/update-order-status.response';
import type {
  UpdateOrderStatusHttpResponse,
  NotFoundHttpResponse,
} from '@modules/order/presentation/http/dto/update-order-status.response';

export class UpdateOrderStatusPresenter
  implements OutputPort<UpdateOrderStatusResponse>
{
  constructor(
    private readonly device: RequestResponseDevice<
      UpdateOrderStatusHttpResponse | NotFoundHttpResponse
    >,
  ) {}

  present(output: UpdateOrderStatusResponse): void {
    if (output.success) {
      const presentedData: UpdateOrderStatusHttpResponse = {
        success: true,
        message: '', // Will be set by endpoint with i18n
      };
      this.device.update(presentedData);
    } else {
      const presentedData: NotFoundHttpResponse = {
        success: false,
        message: '', // Will be set by endpoint with i18n
      };
      this.device.update(presentedData);
    }
  }
}
