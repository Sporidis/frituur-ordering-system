import { CreatePaymentIntentHttpController } from './create-payment-intent.http.controller';
import { GetPaymentIntentHttpController } from './get-payment-intent.http.controller';
import { ProcessPaymentHttpController } from './process-payment.http.controller';
import { CreateRefundHttpController } from './create-refund.http.controller';
import { HandleWebhookHttpController } from './handle-webhook.http.controller';
import { SyncStatusHttpController } from './sync-status.http.controller';
import { GetConfigHttpController } from './get-config.http.controller';
import { GetElementsPageHttpController } from './get-elements-page.http.controller';
import { GetReturnPageHttpController } from './get-return-page.http.controller';
import { CancelPaymentHttpController } from './cancel-payment.http.controller';

export const PAYMENT_NEST_CONTROLLERS = [
  CreatePaymentIntentHttpController,
  GetPaymentIntentHttpController,
  ProcessPaymentHttpController,
  CreateRefundHttpController,
  HandleWebhookHttpController,
  SyncStatusHttpController,
  GetConfigHttpController,
  GetElementsPageHttpController,
  GetReturnPageHttpController,
  CancelPaymentHttpController,
];
