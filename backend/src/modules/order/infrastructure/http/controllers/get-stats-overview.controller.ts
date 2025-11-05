import { Injectable } from '@nestjs/common';
import type { UseCase } from '@shared/application/usecase.interface';
import { GetStatsOverviewRequest } from '@modules/order/application/contracts/requests/get-stats-overview.request';

@Injectable()
export class GetStatsOverviewController {
  constructor(private readonly useCase: UseCase<GetStatsOverviewRequest>) {}

  async handle(): Promise<void> {
    await this.useCase.execute({});
  }
}
