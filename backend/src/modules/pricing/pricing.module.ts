import { Module } from '@nestjs/common';
import { PricingController } from './pricing.controller';
import { PricingService } from './pricing.service';
import { QuoteHttpController } from './presentation/http/controllers/quote.http.controller';

@Module({
  imports: [],
  providers: [PricingService],
  controllers: [PricingController, QuoteHttpController],
  exports: [PricingService],
})
export class PricingModule {}
