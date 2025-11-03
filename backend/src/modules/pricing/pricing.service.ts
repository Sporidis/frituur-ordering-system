import { Injectable } from '@nestjs/common';
import { PriceBreakdown, QuoteItem } from './domain/pricing.types';

@Injectable()
export class PricingService {
  private readonly taxRate = 0.06; // 6% VAT example

  quote(items: QuoteItem[]): PriceBreakdown {
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const tax = Number((subtotal * this.taxRate).toFixed(2));
    const total = Number((subtotal + tax).toFixed(2));
    return { subtotal, tax, total };
  }
}


