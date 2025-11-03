import { Injectable } from '@nestjs/common';
import { OrderService } from '@modules/ordering/order.service';
import { UseCase } from '@shared/application/usecase.interface';
import { CreateOrderRequest } from '@modules/ordering/application/contracts/requests/create-order.request';
import { CreateOrderResponse } from '@modules/ordering/application/contracts/responses/create-order.response';
import { Inject } from '@nestjs/common';
import { PRICING_PORT } from '@modules/pricing/domain/ports/pricing.port';
import type { PricingPort } from '@modules/pricing/domain/ports/pricing.port';

@Injectable()
export class CreateOrderUseCase
  implements UseCase<CreateOrderRequest, CreateOrderResponse>
{
  constructor(
    private readonly orders: OrderService,
    @Inject(PRICING_PORT) private readonly pricing: PricingPort,
  ) {}

  execute(request: CreateOrderRequest): CreateOrderResponse {
    const priceBreakdown = this.pricing.quote(
      request.items.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    );
    const order = this.orders.createOrder(
      request.customerName,
      request.items,
      priceBreakdown.total,
    );
    return {
      id: order.id,
      customerName: order.customerName,
      totalAmount: order.totalAmount,
      status: order.status as string,
    };
  }
}
