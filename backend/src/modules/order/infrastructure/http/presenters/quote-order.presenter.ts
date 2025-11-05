import type { OutputPort } from '@shared/application/contracts/output-port.interface';
import type { RequestResponseDevice } from '@shared/infrastructure/devices/request-response.device';
import type { QuoteOrderResponse } from '@modules/order/application/contracts/responses/quote-order.response';
import type { QuoteOrderHttpResponse } from '@modules/order/presentation/http/dto/quote-order.response';

export class QuoteOrderPresenter implements OutputPort<QuoteOrderResponse> {
  constructor(
    private readonly device: RequestResponseDevice<QuoteOrderHttpResponse>,
  ) {}

  present(output: QuoteOrderResponse): void {
    const presentedData: QuoteOrderHttpResponse = {
      success: true,
      breakdown: output.breakdown,
    };
    this.device.update(presentedData);
  }
}
