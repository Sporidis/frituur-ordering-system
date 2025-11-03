import { PricingPresenters } from '@modules/pricing/presentation/http/presenters/pricing.presenters';

describe('PricingPresenters', () => {
  it('quote returns breakdown and optional title', () => {
    const breakdown = { subtotal: 10, tax: 2, total: 12 } as any;
    const res1 = PricingPresenters.quote(breakdown, 'Quote');
    expect(res1.success).toBe(true);
    expect(res1.breakdown).toBe(breakdown);
    expect(res1.title).toBe('Quote');

    const res2 = PricingPresenters.quote(breakdown);
    expect(res2.title).toBeUndefined();
  });
});
