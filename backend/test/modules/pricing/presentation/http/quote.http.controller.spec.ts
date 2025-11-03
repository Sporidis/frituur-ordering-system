import { QuoteHttpController } from '@modules/pricing/presentation/http/controllers/quote.http.controller';
import { PricingService } from '@modules/pricing/pricing.service';
import { I18nService } from '@modules/i18n/application/i18n.service';

describe('QuoteHttpController', () => {
  let controller: QuoteHttpController;
  let pricing: jest.Mocked<PricingService>;
  let i18n: jest.Mocked<I18nService>;

  beforeEach(() => {
    pricing = { quote: jest.fn() } as any;
    i18n = { translate: jest.fn() } as any;
    controller = new QuoteHttpController(pricing, i18n);
  });

  it('should return presented quote with localized title', () => {
    pricing.quote.mockReturnValue({ subtotal: 10, tax: 2.1, total: 12.1 });
    i18n.translate.mockReturnValue('Quote');

    const body = { items: [{ name: 'Fries', price: 3, quantity: 2 }] } as any;
    const res = controller.handle(body, 'en');

    expect(res.title).toBe('Quote');
    expect(res.breakdown.total).toBeCloseTo(12.1, 5);
    expect(pricing.quote).toHaveBeenCalled();
    expect(i18n.translate).toHaveBeenCalledWith(
      'pricing_quote_title',
      {},
      'en',
    );
  });
});
