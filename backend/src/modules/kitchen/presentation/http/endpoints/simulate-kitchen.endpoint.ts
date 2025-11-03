import { Injectable } from '@nestjs/common';
import { Endpoint } from '@shared/presentation/http/endpoint.interface';
import { SimulateKitchenController } from '@modules/kitchen/presentation/controllers/simulate-kitchen.controller';

@Injectable()
export class SimulateKitchenEndpoint implements Endpoint {
  constructor(private readonly controller: SimulateKitchenController) {}

  handle() {
    return this.controller.handle({});
  }
}
