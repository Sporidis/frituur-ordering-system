import type { PriceBreakdown } from '@modules/pricing/domain/pricing.types';

export const PricingPresenters = {
  quote: (breakdown: PriceBreakdown, title?: string) => ({
    success: true as const,
    breakdown,
    ...(title ? { title } : {}),
  }),
};
