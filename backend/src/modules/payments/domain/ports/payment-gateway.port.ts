import type { Money } from '@shared/domain/value-objects/money';

export const PAYMENT_GATEWAY = 'PAYMENT_GATEWAY';

export interface PaymentGatewayPort {
  createPaymentIntent(
    amount: Money,
    customerId: string,
    orderId: string,
    metadata?: Record<string, any>,
  ): Promise<{ paymentIntentId: string; clientSecret: string }>;

  confirmPaymentIntent(
    paymentIntentId: string,
    paymentMethodId: string,
  ): Promise<{ success: boolean; status: string }>;

  cancelPaymentIntent(paymentIntentId: string): Promise<boolean>;

  createRefund(
    paymentIntentId: string,
    amount?: number,
    reason?: string,
  ): Promise<{ refundId: string; status: string; amount?: number }>;

  getPaymentIntent(paymentIntentId: string): Promise<{
    id: string;
    status: string;
    amount: number;
    currency: string;
    metadata?: Record<string, any>;
  }>;

  constructWebhookEvent(rawBody: Buffer, signature: string): Promise<any>;
}
