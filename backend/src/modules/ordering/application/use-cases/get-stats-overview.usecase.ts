import { Inject, Injectable } from '@nestjs/common';
import {
  ORDER_REPOSITORY,
  type OrderRepository,
} from '@modules/ordering/domain/repositories/order.repository';
import { UseCase } from '@shared/application/usecase.interface';
import { GetStatsOverviewRequest } from '@modules/ordering/application/contracts/requests/get-stats-overview.request';
import { GetStatsOverviewResponse } from '@modules/ordering/application/contracts/responses/get-stats-overview.response';

@Injectable()
export class GetStatsOverviewUseCase
  implements UseCase<GetStatsOverviewRequest, GetStatsOverviewResponse>
{
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orders: OrderRepository,
  ) {}

  execute(): GetStatsOverviewResponse {
    const stats = this.orders.getOrderStats();
    const connectedClients: Record<string, number> = {};
    const totalConnectedClients = 0;
    return { stats, connectedClients, totalConnectedClients };
  }
}
