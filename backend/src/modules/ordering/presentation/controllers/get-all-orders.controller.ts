import { Injectable } from '@nestjs/common';
import { GetAllOrdersUseCase } from '@modules/ordering/application/use-cases';
import {
  GetAllOrdersRequest,
  GetAllOrdersResponse,
} from '@modules/ordering/application/contracts';
import { Controller } from '@shared/presentation/contracts/controller.interface';

@Injectable()
export class GetAllOrdersController implements Controller<GetAllOrdersRequest, GetAllOrdersResponse> {
  constructor(private readonly useCase: GetAllOrdersUseCase) {}

  handle(): GetAllOrdersResponse {
    return this.useCase.execute({} as GetAllOrdersRequest);
  }
}
