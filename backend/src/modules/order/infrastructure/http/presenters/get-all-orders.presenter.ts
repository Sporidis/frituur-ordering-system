import type { OutputPort } from '@shared/application/contracts/output-port.interface';
import type { RequestResponseDevice } from '@shared/infrastructure/devices/request-response.device';
import type { GetAllOrdersResponse } from '@modules/order/application/contracts/responses/get-all-orders.response';
import type { GetAllOrdersHttpResponse } from '@modules/order/presentation/http/dto/get-all-orders.response';

export class GetAllOrdersPresenter implements OutputPort<GetAllOrdersResponse> {
  constructor(
    private readonly device: RequestResponseDevice<GetAllOrdersHttpResponse>,
  ) {}

  present(output: GetAllOrdersResponse): void {
    const presentedData: GetAllOrdersHttpResponse = {
      success: true,
      orders: output.orders.map((order) => ({
        id: order.id,
        customerName: order.customerName,
        totalAmount: order.totalAmount,
        status: order.status,
        items: order.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        estimatedReadyTime: order.estimatedReadyTime.toISOString(),
        createdAt: order.createdAt.toISOString(),
      })),
      count: output.orders.length,
    };
    this.device.update(presentedData);
  }
}
