import { Controller, Get, Header, Query } from '@nestjs/common';
import { GetElementsPageEndpoint } from '../endpoints/get-elements-page.endpoint';

@Controller('payments')
export class GetElementsPageHttpController {
  constructor(private readonly endpoint: GetElementsPageEndpoint) {}

  @Get('elements')
  @Header('Content-Type', 'text/html; charset=utf-8')
  @Header('Cache-Control', 'no-store')
  handle(
    @Query('client_secret') clientSecret?: string,
    @Query('publishable_key') publishableKey?: string,
  ): Promise<string> {
    return this.endpoint.handle(clientSecret, publishableKey);
  }
}
