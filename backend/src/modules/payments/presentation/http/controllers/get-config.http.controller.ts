import { Controller, Get } from '@nestjs/common';
import { GetConfigEndpoint } from '../endpoints/get-config.endpoint';

@Controller('payments')
export class GetConfigHttpController {
  constructor(private readonly endpoint: GetConfigEndpoint) {}

  @Get('config')
  handle() {
    return this.endpoint.handle();
  }
}
