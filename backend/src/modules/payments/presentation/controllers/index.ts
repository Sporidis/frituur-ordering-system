import { CreatePaymentIntentController } from './create-payment-intent.controller';
import { CreateRefundController } from './create-refund.controller';

export const PAYMENT_HTTP_CONTROLLERS = [
  CreatePaymentIntentController,
  CreateRefundController,
];

export { CreatePaymentIntentController, CreateRefundController };
