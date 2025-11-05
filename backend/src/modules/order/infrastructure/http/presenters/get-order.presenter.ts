import type { OutputPort } from '@shared/application/contracts/output-port.interface';
import type { RequestResponseDevice } from '@shared/infrastructure/devices/request-response.device';
import type { GetOrderResponse } from '@modules/order/application/contracts/responses/get-order.response';
import type { GetOrderHttpResponse } from '@modules/order/presentation/http/dto/get-order.response';

export class GetOrderPresenter implements OutputPort<GetOrderResponse> {
  constructor(
    private readonly device: RequestResponseDevice<GetOrderHttpResponse>,
  ) {}

  present(output: GetOrderResponse): void {
    if (!output.order) {
      // Handle not found case - device will have undefined response
      return;
    }

    const presentedData: GetOrderHttpResponse = {
      success: true,
      order: {
        id: output.order.id,
        customerName: output.order.customerName,
        totalAmount: output.order.totalAmount,
        status: output.order.status,
        items: output.order.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        estimatedReadyTime: output.order.estimatedReadyTime.toISOString(),
        createdAt: output.order.createdAt.toISOString(),
      },
    };
    this.device.update(presentedData);
  }
}
