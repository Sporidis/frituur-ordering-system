import { Controller, Get } from '@nestjs/common';

@Controller('pricing')
export class PricingController {
  @Get('ping')
  ping() {
    return { module: 'pricing', status: 'ok' };
  }
}
