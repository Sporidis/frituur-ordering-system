import { Inject } from '@nestjs/common';
import { ORDER_REPOSITORY } from '@modules/order/domain/repositories/order.repository';
import type { OrderRepository } from '@modules/order/domain/repositories/order.repository';
import { UseCase } from '@shared/application/usecase.interface';
import type { OutputPort } from '@shared/application/contracts/output-port.interface';
import { GetStatsOverviewRequest } from '@modules/order/application/contracts/requests/get-stats-overview.request';
import { GetStatsOverviewResponse } from '@modules/order/application/contracts/responses/get-stats-overview.response';

export class GetStatsOverviewUseCase
  implements UseCase<GetStatsOverviewRequest>
{
  constructor(
    private readonly outputPort: OutputPort<GetStatsOverviewResponse>,
    @Inject(ORDER_REPOSITORY) private readonly orders: OrderRepository,
  ) {}

  async execute(_: GetStatsOverviewRequest): Promise<void> {
    const stats = await this.orders.getOrderStats();
    const connectedClients: Record<string, number> = {};
    const totalConnectedClients = 0;
    this.outputPort.present({ stats, connectedClients, totalConnectedClients });
  }
}
