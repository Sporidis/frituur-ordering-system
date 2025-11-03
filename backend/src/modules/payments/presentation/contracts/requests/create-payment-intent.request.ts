export type CreatePaymentIntentRequest = {
  amount: number;
  currency: string;
  customerId?: string;
  orderId?: string;
  paymentMethod?: string;
  metadata?: Record<string, any>;
};
