import { Body, Controller, Post } from '@nestjs/common';
import { PricingService } from '../../../pricing.service';
import { PricingPresenters } from '../presenters/pricing.presenters';
import { QuoteHttpRequest } from '../dto/quote.request';
import { CurrentLocale } from '@modules/i18n/presentation/http/decorators/current-locale.decorator';
import { I18nService } from '@modules/i18n/application/i18n.service';

@Controller('pricing')
export class QuoteHttpController {
  constructor(
    private readonly pricing: PricingService,
    private readonly i18n: I18nService,
  ) {}

  @Post('quote')
  handle(@Body() body: QuoteHttpRequest, @CurrentLocale() locale: string) {
    const breakdown = this.pricing.quote(body.items);
    const title = this.i18n.translate('pricing_quote_title', {}, locale);
    return PricingPresenters.quote(breakdown, title);
  }
}
