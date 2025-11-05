import { Inject, Logger } from '@nestjs/common';
import { UseCase } from '@shared/application/usecase.interface';
import type { OutputPort } from '@shared/application/contracts/output-port.interface';
import {
  SimulateKitchenRequest,
  SimulateKitchenResponse,
} from '@modules/kitchen/application/contracts';
import {
  ORDER_REPOSITORY,
  type OrderRepository,
} from '@modules/order/domain/repositories/order.repository';
import { OrderStatus } from '@modules/order/domain';

export class SimulateKitchenUseCase implements UseCase<SimulateKitchenRequest> {
  private logger = new Logger('SimulateKitchenUseCase');

  constructor(
    private readonly outputPort: OutputPort<SimulateKitchenResponse>,
    @Inject(ORDER_REPOSITORY) private readonly orders: OrderRepository,
  ) {}

  async execute(_: SimulateKitchenRequest): Promise<void> {
    this.logger.log('Starting kitchen workflow simulation...');

    const allOrders = await this.orders.getAllOrders();
    const pendingOrders = allOrders.filter(
      (o) => o.status === OrderStatus.PENDING,
    );
    const inProgressOrders = allOrders.filter(
      (o) => o.status === OrderStatus.IN_PROGRESS,
    );

    if (pendingOrders.length > 0) {
      const order = pendingOrders[0];
      await this.orders.updateOrderStatus(
        order.id,
        OrderStatus.IN_PROGRESS,
        'kitchen_started_preparing',
      );

      setTimeout(async () => {
        await this.orders.updateOrderStatus(
          order.id,
          OrderStatus.READY,
          'order_ready_for_pickup',
        );
      }, 15000);
    }

    if (inProgressOrders.length > 0) {
      const order = inProgressOrders[0];
      await this.orders.updateOrderStatus(
        order.id,
        OrderStatus.READY,
        'Your order is ready for pickup!',
      );
    }

    this.outputPort.present({ message: 'Simulation started' });
  }
}
