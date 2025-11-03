import { Controller, Post } from '@nestjs/common';
import { SimulateKitchenEndpoint } from '@modules/kitchen/presentation/http/endpoints/simulate-kitchen.endpoint';

@Controller('kitchen')
export class SimulateKitchenHttpController {
  constructor(private readonly endpoint: SimulateKitchenEndpoint) {}

  @Post('simulate')
  handle() {
    return this.endpoint.handle();
  }
}
