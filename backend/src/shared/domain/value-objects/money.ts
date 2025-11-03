import { ValueObject } from './value-object';

/**
 * Money value object representing currency amounts
 * Immutable and ensures proper money handling
 */
export class Money extends ValueObject {
  private readonly _amount: number;
  private readonly _currency: string;

  constructor(amount: number, currency: string = 'EUR') {
    super();

    if (!currency || currency.length !== 3) {
      throw new Error('Currency must be a 3-letter code');
    }

    this._amount = Math.round(amount * 100) / 100; // Round to 2 decimal places
    this._currency = currency.toUpperCase();
  }

  get amount(): number {
    return this._amount;
  }

  get currency(): string {
    return this._currency;
  }

  get amountInCents(): number {
    return Math.round(this._amount * 100);
  }

  add(other: Money): Money {
    if (this._currency !== other._currency) {
      throw new Error('Cannot add money with different currencies');
    }
    return new Money(this._amount + other._amount, this._currency);
  }

  subtract(other: Money): Money {
    if (this._currency !== other._currency) {
      throw new Error('Cannot subtract money with different currencies');
    }
    return new Money(this._amount - other._amount, this._currency);
  }

  multiply(factor: number): Money {
    return new Money(this._amount * factor, this._currency);
  }

  divide(divisor: number): Money {
    if (divisor === 0) {
      throw new Error('Cannot divide by zero');
    }
    return new Money(this._amount / divisor, this._currency);
  }

  isGreaterThan(other: Money): boolean {
    this.ensureSameCurrency(other);
    return this._amount > other._amount;
  }

  isLessThan(other: Money): boolean {
    this.ensureSameCurrency(other);
    return this._amount < other._amount;
  }

  isEqualTo(other: Money): boolean {
    this.ensureSameCurrency(other);
    return this._amount === other._amount;
  }

  isZero(): boolean {
    return this._amount === 0;
  }

  isPositive(): boolean {
    return this._amount > 0;
  }

  isNegative(): boolean {
    return this._amount < 0;
  }

  private ensureSameCurrency(other: Money): void {
    if (this._currency !== other._currency) {
      throw new Error('Cannot operate on different currencies');
    }
  }

  toString(): string {
    return `${this._amount.toFixed(2)} ${this._currency}`;
  }

  static zero(currency: string = 'EUR'): Money {
    return new Money(0, currency);
  }

  static fromCents(cents: number, currency: string = 'EUR'): Money {
    return new Money(cents / 100, currency);
  }
}
