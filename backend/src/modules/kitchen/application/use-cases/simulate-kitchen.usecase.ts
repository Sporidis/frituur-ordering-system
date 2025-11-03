import { Inject, Injectable, Logger } from '@nestjs/common';
import { UseCase } from '@shared/application/usecase.interface';
import {
  SimulateKitchenRequest,
  SimulateKitchenResponse,
} from '@modules/kitchen/application/contracts';
import {
  ORDER_REPOSITORY,
  type OrderRepository,
} from '@modules/ordering/domain/repositories/order.repository';
import { OrderStatus } from '@modules/ordering/domain';

@Injectable()
export class SimulateKitchenUseCase
  implements UseCase<SimulateKitchenRequest, SimulateKitchenResponse>
{
  private logger = new Logger('SimulateKitchenUseCase');

  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orders: OrderRepository,
  ) {}

  execute(_: SimulateKitchenRequest): SimulateKitchenResponse {
    this.logger.log('Starting kitchen workflow simulation...');

    const allOrders = this.orders.getAllOrders();
    const pendingOrders = allOrders.filter(
      (o) => o.status === OrderStatus.PENDING,
    );
    const inProgressOrders = allOrders.filter(
      (o) => o.status === OrderStatus.IN_PROGRESS,
    );

    if (pendingOrders.length > 0) {
      const order = pendingOrders[0];
      this.orders.updateOrderStatus(
        order.id,
        OrderStatus.IN_PROGRESS,
        'kitchen_started_preparing',
      );

      setTimeout(() => {
        this.orders.updateOrderStatus(
          order.id,
          OrderStatus.READY,
          'order_ready_for_pickup',
        );
      }, 15000);
    }

    if (inProgressOrders.length > 0) {
      const order = inProgressOrders[0];
      this.orders.updateOrderStatus(
        order.id,
        OrderStatus.READY,
        'Your order is ready for pickup!',
      );
    }

    return { message: 'Simulation started' };
  }
}
