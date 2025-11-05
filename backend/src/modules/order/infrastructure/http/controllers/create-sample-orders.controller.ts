import { Injectable } from '@nestjs/common';
import type { UseCase } from '@shared/application/usecase.interface';
import { CreateSampleOrdersRequest } from '@modules/order/application/contracts/requests/create-sample-orders.request';

@Injectable()
export class CreateSampleOrdersController {
  constructor(private readonly useCase: UseCase<CreateSampleOrdersRequest>) {}

  async handle(): Promise<void> {
    await this.useCase.execute({});
  }
}
