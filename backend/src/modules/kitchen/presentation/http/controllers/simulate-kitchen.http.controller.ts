import { Controller, Post } from '@nestjs/common';
import { SimulateKitchenEndpoint } from '@modules/kitchen/presentation/http/endpoints/simulate-kitchen.endpoint';
import { CurrentLocale } from '@modules/i18n/presentation/http/decorators/current-locale.decorator';

@Controller('kitchen')
export class SimulateKitchenHttpController {
  constructor(private readonly endpoint: SimulateKitchenEndpoint) {}

  @Post('simulate')
  handle(@CurrentLocale() locale: string) {
    return this.endpoint.handle({ locale });
  }
}
