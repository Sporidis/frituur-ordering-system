import type { PriceBreakdown } from '@modules/pricing/domain/pricing.types';

export interface QuoteHttpResponse {
  success: true;
  breakdown: PriceBreakdown;
  title?: string;
}
