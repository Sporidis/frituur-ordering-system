export type HttpSuccess<T> = { success: true } & T;
export type HttpError = { success: false; error: string };

export const PaymentPresenters = {
  createdIntent: (params: {
    paymentIntentId: string;
    clientSecret: string;
    amount: number;
    currency: string;
    message?: string;
  }): HttpSuccess<{ paymentIntent: any; message?: string }> => ({
    success: true,
    paymentIntent: {
      id: params.paymentIntentId,
      clientSecret: params.clientSecret,
      amount: params.amount,
      currency: params.currency,
      status: 'requires_payment_method',
      stripePaymentIntentId: params.paymentIntentId,
    },
    ...(params.message ? { message: params.message } : {}),
  }),

  paymentIntent: (params: {
    id: string;
    amount: number;
    currency: string;
    status: string;
    metadata?: Record<string, any>;
  }): HttpSuccess<{ paymentIntent: any }> => ({
    success: true,
    paymentIntent: {
      id: params.id,
      amount: params.amount,
      currency: params.currency,
      status: params.status,
      metadata: params.metadata,
    },
  }),

  processedPayment: (params: {
    paymentId: string;
    status: string;
    amount: number;
    currency: string;
  }): HttpSuccess<{ payment: any }> => ({
    success: true,
    payment: {
      id: params.paymentId,
      status: params.status,
      amount: params.amount,
      currency: params.currency,
    },
  }),

  refundCreated: (params: {
    refundId: string;
    status: string;
    amount?: number;
    paymentIntentId: string;
    message?: string;
  }): HttpSuccess<{ refund: any; message: string }> => ({
    success: true,
    refund: {
      id: params.refundId,
      status: params.status,
      amount: params.amount,
      paymentIntentId: params.paymentIntentId,
    },
    message: params.message || 'Refund created successfully',
  }),

  error: (message: string): HttpError => ({ success: false, error: message }),
};
