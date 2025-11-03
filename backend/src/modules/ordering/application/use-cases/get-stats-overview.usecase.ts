import { Injectable } from '@nestjs/common';
import { OrderService } from '../../order.service';
import { UseCase } from '@shared/application/usecase.interface';
import { GetStatsOverviewRequest } from '../contracts/requests/get-stats-overview.request';
import { GetStatsOverviewResponse } from '../contracts/responses/get-stats-overview.response';

@Injectable()
export class GetStatsOverviewUseCase
  implements UseCase<GetStatsOverviewRequest, GetStatsOverviewResponse>
{
  constructor(private readonly orders: OrderService) {}

  execute(): GetStatsOverviewResponse {
    const stats = this.orders.getOrderStats();
    const connectedClients: Record<string, number> = {};
    const totalConnectedClients = 0;
    return { stats, connectedClients, totalConnectedClients };
  }
}
