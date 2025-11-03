import { Money } from '@shared/domain/value-objects/money';

describe('Money Value Object', () => {
  describe('constructor', () => {
    it('should create money with valid amount and currency', () => {
      const money = new Money(10.5, 'EUR');

      expect(money.amount).toBe(10.5);
      expect(money.currency).toBe('EUR');
    });

    it('should create money with different currencies', () => {
      const eurMoney = new Money(10.5, 'EUR');
      const usdMoney = new Money(12.0, 'USD');

      expect(eurMoney.currency).toBe('EUR');
      expect(usdMoney.currency).toBe('USD');
    });

    it('should handle zero amount', () => {
      const money = new Money(0, 'EUR');

      expect(money.amount).toBe(0);
      expect(money.currency).toBe('EUR');
    });

    it('should handle negative amount', () => {
      const money = new Money(-5.25, 'EUR');

      expect(money.amount).toBe(-5.25);
      expect(money.currency).toBe('EUR');
    });
  });

  describe('amountInCents', () => {
    it('should convert amount to cents correctly', () => {
      const money = new Money(10.5, 'EUR');

      expect(money.amountInCents).toBe(1050);
    });

    it('should handle amounts with more than 2 decimal places', () => {
      const money = new Money(10.555, 'EUR');

      expect(money.amountInCents).toBe(1056); // Rounded to nearest cent
    });

    it('should handle zero amount', () => {
      const money = new Money(0, 'EUR');

      expect(money.amountInCents).toBe(0);
    });

    it('should handle negative amounts', () => {
      const money = new Money(-5.25, 'EUR');

      expect(money.amountInCents).toBe(-525);
    });
  });

  describe('add', () => {
    it('should add two money amounts with same currency', () => {
      const money1 = new Money(10.5, 'EUR');
      const money2 = new Money(5.25, 'EUR');

      const result = money1.add(money2);

      expect(result.amount).toBe(15.75);
      expect(result.currency).toBe('EUR');
    });

    it('should throw error when adding different currencies', () => {
      const money1 = new Money(10.5, 'EUR');
      const money2 = new Money(5.25, 'USD');

      expect(() => money1.add(money2)).toThrow(
        'Cannot add money with different currencies',
      );
    });

    it('should handle adding zero', () => {
      const money1 = new Money(10.5, 'EUR');
      const money2 = new Money(0, 'EUR');

      const result = money1.add(money2);

      expect(result.amount).toBe(10.5);
      expect(result.currency).toBe('EUR');
    });
  });

  describe('subtract', () => {
    it('should subtract two money amounts with same currency', () => {
      const money1 = new Money(10.5, 'EUR');
      const money2 = new Money(5.25, 'EUR');

      const result = money1.subtract(money2);

      expect(result.amount).toBe(5.25);
      expect(result.currency).toBe('EUR');
    });

    it('should throw error when subtracting different currencies', () => {
      const money1 = new Money(10.5, 'EUR');
      const money2 = new Money(5.25, 'USD');

      expect(() => money1.subtract(money2)).toThrow(
        'Cannot subtract money with different currencies',
      );
    });

    it('should handle negative results', () => {
      const money1 = new Money(5.25, 'EUR');
      const money2 = new Money(10.5, 'EUR');

      const result = money1.subtract(money2);

      expect(result.amount).toBe(-5.25);
      expect(result.currency).toBe('EUR');
    });
  });

  describe('multiply', () => {
    it('should multiply money by a number', () => {
      const money = new Money(10.5, 'EUR');

      const result = money.multiply(2);

      expect(result.amount).toBe(21.0);
      expect(result.currency).toBe('EUR');
    });

    it('should handle multiplication by zero', () => {
      const money = new Money(10.5, 'EUR');

      const result = money.multiply(0);

      expect(result.amount).toBe(0);
      expect(result.currency).toBe('EUR');
    });

    it('should handle multiplication by decimal', () => {
      const money = new Money(10.0, 'EUR');

      const result = money.multiply(0.5);

      expect(result.amount).toBe(5.0);
      expect(result.currency).toBe('EUR');
    });
  });

  describe('equals', () => {
    it('should return true for equal money objects', () => {
      const money1 = new Money(10.5, 'EUR');
      const money2 = new Money(10.5, 'EUR');

      expect(money1.equals(money2)).toBe(true);
    });

    it('should return false for different amounts', () => {
      const money1 = new Money(10.5, 'EUR');
      const money2 = new Money(10.51, 'EUR');

      expect(money1.equals(money2)).toBe(false);
    });

    it('should return false for different currencies', () => {
      const money1 = new Money(10.5, 'EUR');
      const money2 = new Money(10.5, 'USD');

      expect(money1.equals(money2)).toBe(false);
    });

    it('should return false for null or undefined', () => {
      const money = new Money(10.5, 'EUR');

      expect(money.equals(null)).toBe(false);
      expect(money.equals(undefined)).toBe(false);
    });
  });

  describe('isZero', () => {
    it('should return true for zero amount', () => {
      const money = new Money(0, 'EUR');

      expect(money.isZero()).toBe(true);
    });

    it('should return false for non-zero amount', () => {
      const money = new Money(10.5, 'EUR');

      expect(money.isZero()).toBe(false);
    });
  });

  describe('isPositive', () => {
    it('should return true for positive amount', () => {
      const money = new Money(10.5, 'EUR');

      expect(money.isPositive()).toBe(true);
    });

    it('should return false for zero amount', () => {
      const money = new Money(0, 'EUR');

      expect(money.isPositive()).toBe(false);
    });

    it('should return false for negative amount', () => {
      const money = new Money(-10.5, 'EUR');

      expect(money.isPositive()).toBe(false);
    });
  });

  describe('isNegative', () => {
    it('should return true for negative amount', () => {
      const money = new Money(-10.5, 'EUR');

      expect(money.isNegative()).toBe(true);
    });

    it('should return false for zero amount', () => {
      const money = new Money(0, 'EUR');

      expect(money.isNegative()).toBe(false);
    });

    it('should return false for positive amount', () => {
      const money = new Money(10.5, 'EUR');

      expect(money.isNegative()).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return formatted string representation', () => {
      const money = new Money(10.5, 'EUR');

      expect(money.toString()).toBe('10.50 EUR');
    });

    it('should handle negative amounts', () => {
      const money = new Money(-5.25, 'USD');

      expect(money.toString()).toBe('-5.25 USD');
    });
  });
});
