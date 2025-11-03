import { Body, Controller, Post } from '@nestjs/common';
import { PricingService } from '../../../pricing.service';
import { QuoteItem } from '../../../domain/pricing.types';

@Controller('pricing')
export class QuoteHttpController {
  constructor(private readonly pricing: PricingService) {}

  @Post('quote')
  handle(@Body() body: { items: QuoteItem[] }) {
    return { success: true, breakdown: this.pricing.quote(body.items) };
  }
}
