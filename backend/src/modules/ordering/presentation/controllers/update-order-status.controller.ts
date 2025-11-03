import { Injectable } from '@nestjs/common';
import { UpdateOrderStatusUseCase } from '@modules/ordering/application/use-cases';
import {
  UpdateOrderStatusRequest,
  UpdateOrderStatusResponse,
} from '@modules/ordering/application/contracts';
import { Controller } from '@shared/presentation/contracts/controller.interface';

@Injectable()
export class UpdateOrderStatusController
  implements Controller<UpdateOrderStatusRequest, UpdateOrderStatusResponse>
{
  constructor(private readonly useCase: UpdateOrderStatusUseCase) {}

  handle(request: UpdateOrderStatusRequest): UpdateOrderStatusResponse {
    return this.useCase.execute(request);
  }
}
