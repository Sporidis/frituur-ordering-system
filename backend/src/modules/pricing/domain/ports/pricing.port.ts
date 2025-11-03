import type {
  PriceBreakdown,
  QuoteItem,
} from '@modules/pricing/domain/pricing.types';

export const PRICING_PORT = 'PRICING_PORT';

export interface PricingPort {
  quote(items: QuoteItem[]): PriceBreakdown;
}
