import { Controller, Get, Header, Query } from '@nestjs/common';
import { GetReturnPageEndpoint } from '../endpoints/get-return-page.endpoint';

@Controller('payments')
export class GetReturnPageHttpController {
  constructor(private readonly endpoint: GetReturnPageEndpoint) {}

  @Get('return')
  @Header('Content-Type', 'text/html; charset=utf-8')
  @Header('Cache-Control', 'no-store')
  handle(@Query('publishable_key') publishableKey?: string): Promise<string> {
    return this.endpoint.handle(publishableKey);
  }
}
