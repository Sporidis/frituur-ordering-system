import { Injectable } from '@nestjs/common';
import { GetStatsOverviewUseCase } from '@modules/ordering/application/use-cases';
import {
  GetStatsOverviewRequest,
  GetStatsOverviewResponse,
} from '@modules/ordering/application/contracts';
import { Controller } from '@shared/presentation/contracts/controller.interface';

@Injectable()
export class GetStatsOverviewController implements Controller<GetStatsOverviewRequest, GetStatsOverviewResponse> {
  constructor(private readonly useCase: GetStatsOverviewUseCase) {}

  handle(): GetStatsOverviewResponse {
    return this.useCase.execute();
  }
}
