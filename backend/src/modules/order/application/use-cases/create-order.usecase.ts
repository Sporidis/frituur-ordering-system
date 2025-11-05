import { Injectable, Inject } from '@nestjs/common';
import { ORDER_REPOSITORY } from '@modules/order/domain/repositories/order.repository';
import type { OrderRepository } from '@modules/order/domain/repositories/order.repository';
import { UseCase } from '@shared/application/usecase.interface';
import type { OutputPort } from '@shared/application/contracts/output-port.interface';
import { CreateOrderRequest } from '@modules/order/application/contracts/requests/create-order.request';
import { CreateOrderResponse } from '@modules/order/application/contracts/responses/create-order.response';
import { OrderEntity } from '@modules/order/domain/order.entity';
import { OrderItem } from '@modules/order/domain';

@Injectable()
export class CreateOrderUseCase implements UseCase<CreateOrderRequest> {
  constructor(
    private readonly outputPort: OutputPort<CreateOrderResponse>,
    @Inject(ORDER_REPOSITORY) private readonly orders: OrderRepository,
  ) {}

  async execute(input: CreateOrderRequest): Promise<void> {
    const priceBreakdown = OrderEntity.calculateTotalWithTax(
      input.items.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })) as OrderItem[],
    );

    const order = await this.orders.createOrder(
      input.customerName,
      input.items,
      priceBreakdown.total,
    );

    this.outputPort.present({
      id: order.id,
      customerName: order.customerName,
      totalAmount: order.totalAmount,
      status: order.status as string,
      items: order.items,
      estimatedReadyTime: order.estimatedReadyTime,
      createdAt: order.createdAt,
    });
  }
}
