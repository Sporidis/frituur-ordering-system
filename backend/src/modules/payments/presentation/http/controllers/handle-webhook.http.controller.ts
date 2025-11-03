import { Controller, Headers, Post, Req } from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import { HandleWebhookEndpoint } from '../endpoints/handle-webhook.endpoint';

@Controller('payments')
export class HandleWebhookHttpController {
  constructor(private readonly endpoint: HandleWebhookEndpoint) {}

  @Post('webhook')
  handle(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    return this.endpoint.handle(req.rawBody!, signature);
  }
}
