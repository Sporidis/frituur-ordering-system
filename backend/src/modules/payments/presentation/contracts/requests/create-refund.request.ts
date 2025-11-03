export type CreateRefundRequest = {
  paymentIntentId: string;
  amount?: number;
  reason?: string;
};
