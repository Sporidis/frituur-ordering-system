import { Injectable } from '@nestjs/common';
import type { UseCase } from '@shared/application/usecase.interface';
import { SimulateKitchenRequest } from '@modules/kitchen/application/contracts';

@Injectable()
export class SimulateKitchenController {
  constructor(private readonly useCase: UseCase<SimulateKitchenRequest>) {}

  async handle(): Promise<void> {
    await this.useCase.execute({});
  }
}
