import type { OutputPort } from '@shared/application/contracts/output-port.interface';
import type { RequestResponseDevice } from '@shared/infrastructure/devices/request-response.device';
import type { GetStatsOverviewResponse } from '@modules/order/application/contracts/responses/get-stats-overview.response';
import type { GetStatsOverviewHttpResponse } from '@modules/order/presentation/http/dto/get-stats-overview.response';

export class GetStatsOverviewPresenter
  implements OutputPort<GetStatsOverviewResponse>
{
  constructor(
    private readonly device: RequestResponseDevice<GetStatsOverviewHttpResponse>,
  ) {}

  present(output: GetStatsOverviewResponse): void {
    const presentedData: GetStatsOverviewHttpResponse = {
      success: true,
      stats: output.stats,
      connectedClients: output.connectedClients,
      totalConnectedClients: output.totalConnectedClients,
    };
    this.device.update(presentedData);
  }
}
