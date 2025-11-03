import { InMemoryPaymentRepository } from '@modules/payments/infrastructure/payment-repository.impl';
import { Payment } from '@modules/payments/domain/payment.entity';
import { Money } from '@shared/domain/value-objects/money';
import { PaymentMethod } from '@modules/payments/domain/payment-method.enum';
import { PaymentStatus } from '@modules/payments/domain/payment-status.enum';

describe('InMemoryPaymentRepository', () => {
  let repository: InMemoryPaymentRepository;
  let payment: Payment;

  beforeEach(() => {
    repository = new InMemoryPaymentRepository();
    payment = new Payment(
      new Money(10.5, 'EUR'),
      'customer_123',
      'order_456',
      PaymentMethod.CARD,
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('save', () => {
    it('should save a new payment', async () => {
      const savedPayment = await repository.save(payment);

      expect(savedPayment).toBe(payment);
      expect(savedPayment.id).toBeDefined();
    });

    it('should update an existing payment', async () => {
      await repository.save(payment);
      payment.markAsProcessing('pi_test_123');

      const updatedPayment = await repository.save(payment);

      expect(updatedPayment.status).toBe(PaymentStatus.PROCESSING);
      expect(updatedPayment.stripePaymentIntentId).toBe('pi_test_123');
    });
  });

  describe('findById', () => {
    it('should find a payment by id', async () => {
      await repository.save(payment);

      const foundPayment = await repository.findById(payment.id);

      expect(foundPayment).toBe(payment);
    });

    it('should return null for non-existent payment', async () => {
      const foundPayment = await repository.findById('nonexistent');

      expect(foundPayment).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all payments', async () => {
      const payment1 = new Payment(
        new Money(10.5, 'EUR'),
        'customer_1',
        'order_1',
      );
      const payment2 = new Payment(
        new Money(20.0, 'EUR'),
        'customer_2',
        'order_2',
      );

      await repository.save(payment1);
      await repository.save(payment2);

      const allPayments = await repository.findAll();

      expect(allPayments).toHaveLength(2);
      expect(allPayments).toContain(payment1);
      expect(allPayments).toContain(payment2);
    });

    it('should return empty array when no payments exist', async () => {
      const allPayments = await repository.findAll();

      expect(allPayments).toHaveLength(0);
    });
  });

  describe('findByCustomerId', () => {
    it('should find payments by customer id', async () => {
      const payment1 = new Payment(
        new Money(10.5, 'EUR'),
        'customer_123',
        'order_1',
      );
      const payment2 = new Payment(
        new Money(20.0, 'EUR'),
        'customer_123',
        'order_2',
      );
      const payment3 = new Payment(
        new Money(15.0, 'EUR'),
        'customer_456',
        'order_3',
      );

      await repository.save(payment1);
      await repository.save(payment2);
      await repository.save(payment3);

      const customerPayments =
        await repository.findByCustomerId('customer_123');

      expect(customerPayments).toHaveLength(2);
      expect(customerPayments).toContain(payment1);
      expect(customerPayments).toContain(payment2);
    });

    it('should return empty array for non-existent customer', async () => {
      const customerPayments = await repository.findByCustomerId('nonexistent');

      expect(customerPayments).toHaveLength(0);
    });
  });

  describe('findByOrderId', () => {
    it('should find payments by order id', async () => {
      await repository.save(payment);

      const foundPayments = await repository.findByOrderId('order_456');

      expect(foundPayments).toHaveLength(1);
      expect(foundPayments[0]).toBe(payment);
    });

    it('should return empty array for non-existent order', async () => {
      const foundPayments = await repository.findByOrderId('nonexistent');

      expect(foundPayments).toHaveLength(0);
    });
  });

  describe('findByStatus', () => {
    it('should find payments by status', async () => {
      const payment1 = new Payment(
        new Money(10.5, 'EUR'),
        'customer_1',
        'order_1',
      );
      const payment2 = new Payment(
        new Money(20.0, 'EUR'),
        'customer_2',
        'order_2',
      );

      payment1.markAsProcessing('pi_test_1');
      payment2.markAsProcessing('pi_test_2');
      payment2.markAsSucceeded('ch_test_2');

      await repository.save(payment1);
      await repository.save(payment2);

      const processingPayments = await repository.findByStatus(
        PaymentStatus.PROCESSING,
      );
      const succeededPayments = await repository.findByStatus(
        PaymentStatus.SUCCEEDED,
      );

      expect(processingPayments).toHaveLength(1);
      expect(processingPayments[0]).toBe(payment1);

      expect(succeededPayments).toHaveLength(1);
      expect(succeededPayments[0]).toBe(payment2);
    });
  });

  describe('delete', () => {
    it('should delete a payment', async () => {
      await repository.save(payment);

      const deleted = await repository.delete(payment.id);

      expect(deleted).toBe(true);

      const foundPayment = await repository.findById(payment.id);
      expect(foundPayment).toBeNull();
    });

    it('should return false for non-existent payment', async () => {
      const deleted = await repository.delete('nonexistent');

      expect(deleted).toBe(false);
    });
  });

  describe('count', () => {
    it('should return correct count', async () => {
      expect(await repository.count()).toBe(0);

      await repository.save(payment);
      expect(await repository.count()).toBe(1);

      const payment2 = new Payment(
        new Money(20.0, 'EUR'),
        'customer_2',
        'order_2',
      );
      await repository.save(payment2);
      expect(await repository.count()).toBe(2);
    });
  });
});
