import { Injectable } from '@nestjs/common';
import { CreateSampleOrdersUseCase } from '@modules/ordering/application/use-cases';
import {
  CreateSampleOrdersRequest,
  CreateSampleOrdersResponse,
} from '@modules/ordering/application/contracts';
import { Controller } from '@shared/presentation/contracts/controller.interface';

@Injectable()
export class CreateSampleOrdersController
  implements Controller<CreateSampleOrdersRequest, CreateSampleOrdersResponse>
{
  constructor(private readonly useCase: CreateSampleOrdersUseCase) {}

  handle(): CreateSampleOrdersResponse {
    return this.useCase.execute({} as CreateSampleOrdersRequest);
  }
}
