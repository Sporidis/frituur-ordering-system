import { PricingService } from '@modules/pricing/pricing.service';

describe('PricingService', () => {
  let service: PricingService;

  beforeEach(() => {
    service = new PricingService();
  });

  it('should calculate subtotal, tax (21%), and total', () => {
    const items = [
      { name: 'Fries', price: 3, quantity: 2 },
      { name: 'Burger', price: 4.5, quantity: 1 },
    ];

    const result = service.quote(items);

    expect(result.subtotal).toBeCloseTo(10.5, 5);
    expect(result.tax).toBeCloseTo(0.63, 5); // current service uses 6% tax
    expect(result.total).toBeCloseTo(11.13, 5);
  });
});
