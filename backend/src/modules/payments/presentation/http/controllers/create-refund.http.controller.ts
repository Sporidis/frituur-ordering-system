import { Body, Controller, Post } from '@nestjs/common';
import { CreateRefundEndpoint } from '../endpoints/create-refund.endpoint';
import type { CreateRefundRequest } from '../../contracts/requests/create-refund.request';
import { CurrentLocale } from '@modules/i18n/presentation/http/decorators/current-locale.decorator';

@Controller('payments')
export class CreateRefundHttpController {
  constructor(private readonly endpoint: CreateRefundEndpoint) {}

  @Post('refund')
  handle(@Body() body: CreateRefundRequest, @CurrentLocale() locale: string) {
    return this.endpoint.handle({ ...body, locale });
  }
}
