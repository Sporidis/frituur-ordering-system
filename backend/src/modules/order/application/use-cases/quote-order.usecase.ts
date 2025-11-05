import { UseCase } from '@shared/application/usecase.interface';
import type { OutputPort } from '@shared/application/contracts/output-port.interface';
import { QuoteOrderRequest } from '@modules/order/application/contracts/requests/quote-order.request';
import { QuoteOrderResponse } from '@modules/order/application/contracts/responses/quote-order.response';
import { OrderEntity } from '@modules/order/domain/order.entity';
import { OrderItem } from '@modules/order/domain';

export class QuoteOrderUseCase implements UseCase<QuoteOrderRequest> {
  constructor(private readonly outputPort: OutputPort<QuoteOrderResponse>) {}

  async execute(input: QuoteOrderRequest): Promise<void> {
    const breakdown = OrderEntity.calculateTotalWithTax(
      input.items.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })) as OrderItem[],
    );

    this.outputPort.present({ breakdown });
  }
}
