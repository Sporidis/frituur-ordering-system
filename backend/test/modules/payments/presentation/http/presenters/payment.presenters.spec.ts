import { PaymentPresenters } from '@modules/payments/presentation/http/presenters/payment.presenters';

describe('PaymentPresenters', () => {
  it('createdIntent includes optional message and maps fields', () => {
    const res = PaymentPresenters.createdIntent({
      paymentIntentId: 'pi_123',
      clientSecret: 'secret_456',
      amount: 1050,
      currency: 'eur',
      message: 'Created',
    });
    expect(res.success).toBe(true);
    expect(res.paymentIntent.id).toBe('pi_123');
    expect(res.paymentIntent.clientSecret).toBe('secret_456');
    expect(res.paymentIntent.amount).toBe(1050);
    expect(res.paymentIntent.currency).toBe('eur');
    expect(res.message).toBe('Created');
  });

  it('paymentIntent maps metadata', () => {
    const res = PaymentPresenters.paymentIntent({
      id: 'pi_1',
      amount: 500,
      currency: 'eur',
      status: 'requires_payment_method',
      metadata: { orderId: 'o1' },
    });
    expect(res.success).toBe(true);
    expect(res.paymentIntent.metadata.orderId).toBe('o1');
  });

  it('processedPayment maps payment fields', () => {
    const res = PaymentPresenters.processedPayment({
      paymentId: 'pay_1',
      status: 'succeeded',
      amount: 1000,
      currency: 'eur',
    });
    expect(res.success).toBe(true);
    expect(res.payment.id).toBe('pay_1');
    expect(res.payment.status).toBe('succeeded');
  });

  it('refundCreated returns default message and maps fields', () => {
    const res = PaymentPresenters.refundCreated({
      refundId: 're_1',
      status: 'succeeded',
      amount: 500,
      paymentIntentId: 'pi_1',
    });
    expect(res.success).toBe(true);
    expect(res.refund.id).toBe('re_1');
    expect(res.message).toBe('Refund created successfully');
  });

  it('error presenter', () => {
    const res = PaymentPresenters.error('Oops');
    expect(res.success).toBe(false);
    expect(res.error).toBe('Oops');
  });
});
