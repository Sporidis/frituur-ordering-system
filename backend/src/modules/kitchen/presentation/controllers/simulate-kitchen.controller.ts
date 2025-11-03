import { Injectable } from '@nestjs/common';
import { Controller } from '@shared/presentation/contracts/controller.interface';
import {
  SimulateKitchenRequest,
  SimulateKitchenResponse,
} from '@modules/kitchen/application/contracts';
import { SimulateKitchenUseCase } from '@modules/kitchen/application/use-cases/simulate-kitchen.usecase';

@Injectable()
export class SimulateKitchenController
  implements Controller<SimulateKitchenRequest, SimulateKitchenResponse>
{
  constructor(private readonly useCase: SimulateKitchenUseCase) {}

  handle(_: SimulateKitchenRequest): SimulateKitchenResponse {
    return this.useCase.execute({});
  }
}
