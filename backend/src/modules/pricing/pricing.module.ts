import { Module } from '@nestjs/common';
import { PricingController } from './pricing.controller';
import { PricingService } from './pricing.service';
import { PRICING_PORT } from './domain/ports/pricing.port';
import { QuoteHttpController } from './presentation/http/controllers/quote.http.controller';

@Module({
  imports: [],
  providers: [
    PricingService,
    { provide: PRICING_PORT, useExisting: PricingService },
  ],
  controllers: [PricingController, QuoteHttpController],
  exports: [PricingService, PRICING_PORT],
})
export class PricingModule {}
