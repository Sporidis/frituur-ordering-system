import { Payment } from '@modules/payments/domain/payment.entity';
import { Money } from '@shared/domain/value-objects/money';
import { PaymentMethod } from '@modules/payments/domain/payment-method.enum';
import { PaymentStatus } from '@modules/payments/domain/payment-status.enum';

describe('Payment Entity', () => {
  let payment: Payment;

  beforeEach(() => {
    payment = new Payment(
      new Money(10.5, 'EUR'),
      'customer_123',
      'order_456',
      PaymentMethod.CARD,
    );
  });

  it('should create a payment with correct initial state', () => {
    expect(payment.amount.amount).toBe(10.5);
    expect(payment.amount.currency).toBe('EUR');
    expect(payment.customerId).toBe('customer_123');
    expect(payment.orderId).toBe('order_456');
    expect(payment.paymentMethod).toBe(PaymentMethod.CARD);
    expect(payment.status).toBe(PaymentStatus.PENDING);
    expect(payment.id).toBeDefined();
    expect(payment.createdAt).toBeDefined();
    expect(payment.updatedAt).toBeDefined();
  });

  it('should mark payment as processing', () => {
    payment.markAsProcessing('pi_test_123');

    expect(payment.status).toBe(PaymentStatus.PROCESSING);
    expect(payment.stripePaymentIntentId).toBe('pi_test_123');
  });

  it('should mark payment as succeeded', () => {
    payment.markAsProcessing('pi_test_123');
    payment.markAsSucceeded('ch_test_123');

    expect(payment.status).toBe(PaymentStatus.SUCCEEDED);
    expect(payment.stripeChargeId).toBe('ch_test_123');
  });

  it('should mark payment as failed', () => {
    payment.markAsFailed('Insufficient funds');

    expect(payment.status).toBe(PaymentStatus.FAILED);
    expect(payment.failureReason).toBe('Insufficient funds');
  });

  it('should mark payment as cancelled', () => {
    payment.markAsCancelled();

    expect(payment.status).toBe(PaymentStatus.CANCELLED);
  });

  it('should not allow cancelling a succeeded payment', () => {
    payment.markAsProcessing('pi_test_123');
    payment.markAsSucceeded('ch_test_123');

    expect(() => payment.markAsCancelled()).toThrow(
      'Cannot cancel a succeeded payment',
    );
  });

  it('should not allow marking as succeeded without processing', () => {
    expect(() => payment.markAsSucceeded('ch_test_123')).toThrow();
  });

  it('should check if payment is final', () => {
    expect(payment.isFinal()).toBe(false);

    payment.markAsProcessing('pi_test_123');
    payment.markAsSucceeded('ch_test_123');
    expect(payment.isFinal()).toBe(true);

    payment = new Payment(new Money(10.5, 'EUR'), 'customer_123', 'order_456');
    payment.markAsFailed('Error');
    expect(payment.isFinal()).toBe(true);

    payment = new Payment(new Money(10.5, 'EUR'), 'customer_123', 'order_456');
    payment.markAsCancelled();
    expect(payment.isFinal()).toBe(true);
  });

  it('should check if payment can be refunded', () => {
    expect(payment.canBeRefunded()).toBe(false);

    payment.markAsProcessing('pi_test_123');
    expect(payment.canBeRefunded()).toBe(false);

    payment.markAsSucceeded('ch_test_123');
    expect(payment.canBeRefunded()).toBe(true);

    // Create a new payment for the failed test since we can't mark succeeded as failed
    const failedPayment = new Payment(
      new Money(10.5, 'EUR'),
      'customer_123',
      'order_456',
    );
    failedPayment.markAsFailed('Error');
    expect(failedPayment.canBeRefunded()).toBe(false);
  });

  it('should update metadata', () => {
    payment.updateMetadata({ test: 'value', orderType: 'delivery' });

    expect(payment.metadata).toEqual({ test: 'value', orderType: 'delivery' });
  });

  it('should merge metadata', () => {
    payment.updateMetadata({ test: 'value' });
    payment.updateMetadata({ orderType: 'delivery' });

    expect(payment.metadata).toEqual({ test: 'value', orderType: 'delivery' });
  });
});
