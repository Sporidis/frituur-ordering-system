import { CreatePaymentIntentEndpoint } from './create-payment-intent.endpoint';
import { CreateRefundEndpoint } from './create-refund.endpoint';
import { GetConfigEndpoint } from './get-config.endpoint';
import { GetElementsPageEndpoint } from './get-elements-page.endpoint';
import { GetPaymentIntentEndpoint } from './get-payment-intent.endpoint';
import { GetReturnPageEndpoint } from './get-return-page.endpoint';
import { HandleWebhookEndpoint } from './handle-webhook.endpoint';
import { ProcessPaymentEndpoint } from './process-payment.endpoint';
import { SyncStatusEndpoint } from './sync-status.endpoint';


export const PAYMENT_HTTP_ENDPOINTS = [
  CreatePaymentIntentEndpoint,
  GetPaymentIntentEndpoint,
  ProcessPaymentEndpoint,
  CreateRefundEndpoint,
  HandleWebhookEndpoint,
  SyncStatusEndpoint,
  GetConfigEndpoint,
  GetElementsPageEndpoint,
  GetReturnPageEndpoint,
];
