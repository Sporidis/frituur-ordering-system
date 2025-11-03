import { StripePaymentGateway } from '@modules/payments/infrastructure/stripe-payment-gateway';
import { Money } from '@shared/domain/value-objects/money';

jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    paymentIntents: {
      create: jest
        .fn()
        .mockResolvedValue({ id: 'pi_1', client_secret: 'secret' }),
      confirm: jest.fn().mockResolvedValue({ id: 'pi_1', status: 'succeeded' }),
      cancel: jest.fn().mockResolvedValue({ id: 'pi_1', status: 'canceled' }),
      retrieve: jest.fn().mockResolvedValue({
        id: 'pi_1',
        status: 'succeeded',
        amount: 1050,
        currency: 'eur',
        metadata: { orderId: 'o1' },
      }),
    },
    refunds: {
      create: jest
        .fn()
        .mockResolvedValue({ id: 're_1', status: 'succeeded', amount: 500 }),
    },
    webhooks: {
      constructEvent: jest
        .fn()
        .mockReturnValue({ type: 'payment_intent.succeeded' }),
    },
  }));
});

describe('StripePaymentGateway', () => {
  let gateway: StripePaymentGateway;

  beforeEach(() => {
    gateway = new StripePaymentGateway();
  });

  it('creates payment intent', async () => {
    const res = await gateway.createPaymentIntent(
      Money.fromCents(1050, 'EUR'),
      'c1',
      'o1',
      { note: 'test' },
    );
    expect(res.paymentIntentId).toBe('pi_1');
    expect(res.clientSecret).toBe('secret');
  });

  it('confirms payment intent', async () => {
    const res = await gateway.confirmPaymentIntent('pi_1', 'pm_1');
    expect(res.success).toBe(true);
    expect(res.status).toBe('succeeded');
  });

  it('cancels payment intent', async () => {
    const res = await gateway.cancelPaymentIntent('pi_1');
    expect(res).toBe(true);
  });

  it('creates refund', async () => {
    const res = await gateway.createRefund(
      'pi_1',
      500,
      'requested_by_customer',
    );
    expect(res.refundId).toBe('re_1');
    expect(res.status).toBe('succeeded');
    expect(res.amount).toBe(500);
  });

  it('retrieves payment intent', async () => {
    const res = await gateway.getPaymentIntent('pi_1');
    expect(res.id).toBe('pi_1');
    expect(res.amount).toBe(1050);
    expect(res.currency).toBe('eur');
  });

  it('constructs webhook event', async () => {
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test';
    const event = await gateway.constructWebhookEvent(
      Buffer.from('raw'),
      'sig',
    );
    expect(event.type).toBe('payment_intent.succeeded');
  });
});
