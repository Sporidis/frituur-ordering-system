import { OutputPort } from '@shared/application/contracts/output-port.interface';
import { RequestResponseDevice } from '@shared/infrastructure/devices/request-response.device';
import { CreateOrderResponse } from '@modules/order/application/contracts/responses/create-order.response';
import type { CreateOrderHttpResponse } from '@modules/order/presentation/http/dto/create-order.response';

/**
 * Presenter for CreateOrder use case output
 * Implements OutputPort to transform application output to HTTP response format
 */
export class CreateOrderPresenter implements OutputPort<CreateOrderResponse> {
  constructor(
    private readonly device: RequestResponseDevice<CreateOrderHttpResponse>,
  ) {}

  present(output: CreateOrderResponse): void {
    const presentedData = this.mapToPresentedData(output);
    this.device.update(presentedData);
  }

  private mapToPresentedData(
    output: CreateOrderResponse,
  ): CreateOrderHttpResponse {
    return {
      success: true,
      order: {
        id: output.id,
        customerName: output.customerName,
        totalAmount: output.totalAmount,
        status: output.status,
        items: output.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        estimatedReadyTime: output.estimatedReadyTime.toISOString(),
        createdAt: output.createdAt.toISOString(),
      },
      message: '', // Will be set by endpoint with i18n
    };
  }
}
