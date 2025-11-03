import { Controller, Get } from '@nestjs/common';

@Controller('kitchen')
export class KitchenController {
  @Get('ping')
  ping() {
    return { module: 'kitchen', status: 'ok' };
  }
}
