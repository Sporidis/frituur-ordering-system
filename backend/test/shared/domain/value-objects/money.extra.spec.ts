import { Money } from '@shared/domain/value-objects/money';

describe('Money (extra)', () => {
  it('rounds to 2 decimals and uppercases currency', () => {
    const m = new Money(10.567, 'eur');
    expect(m.amount).toBe(10.57);
    expect(m.currency).toBe('EUR');
    expect(m.amountInCents).toBe(1057);
  });

  it('add/subtract enforce same currency', () => {
    const a = new Money(5, 'EUR');
    const b = new Money(2.5, 'EUR');
    expect(a.add(b).amount).toBe(7.5);
    expect(a.subtract(b).amount).toBe(2.5);
    const usd = new Money(1, 'USD');
    expect(() => a.add(usd)).toThrow(
      'Cannot add money with different currencies',
    );
    expect(() => a.subtract(usd)).toThrow(
      'Cannot subtract money with different currencies',
    );
  });

  it('multiply/divide and division by zero', () => {
    const a = new Money(10, 'EUR');
    expect(a.multiply(1.5).amount).toBe(15);
    expect(a.divide(2).amount).toBe(5);
    expect(() => a.divide(0)).toThrow('Cannot divide by zero');
  });

  it('comparisons enforce same currency and detect zero/positive/negative', () => {
    const a = new Money(10, 'EUR');
    const b = new Money(5, 'EUR');
    expect(a.isGreaterThan(b)).toBe(true);
    expect(b.isLessThan(a)).toBe(true);
    expect(a.isEqualTo(new Money(10, 'EUR'))).toBe(true);
    const usd = new Money(10, 'USD');
    expect(() => a.isEqualTo(usd)).toThrow(
      'Cannot operate on different currencies',
    );
    expect(Money.zero('EUR').isZero()).toBe(true);
    expect(new Money(1, 'EUR').isPositive()).toBe(true);
    expect(new Money(-1, 'EUR').isNegative()).toBe(true);
  });

  it('fromCents and toString', () => {
    const m = Money.fromCents(1234, 'eur');
    expect(m.amount).toBe(12.34);
    expect(m.toString()).toBe('12.34 EUR');
  });

  it('throws on invalid currency', () => {
    expect(() => new Money(1, 'E')).toThrow('Currency must be a 3-letter code');
  });
});
