import { Body, Controller, Post } from '@nestjs/common';
import { SyncStatusEndpoint } from '../endpoints/sync-status.endpoint';

@Controller('payments')
export class SyncStatusHttpController {
  constructor(private readonly endpoint: SyncStatusEndpoint) {}

  @Post('sync-status')
  handle(@Body() body: { paymentIntentId: string }) {
    return this.endpoint.handle(body.paymentIntentId);
  }
}
