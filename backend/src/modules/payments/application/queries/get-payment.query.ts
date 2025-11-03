import { IQuery } from '@shared/application/queries/query.interface';

/**
 * Query to get a payment by ID
 */
export class GetPaymentQuery implements IQuery {
  readonly queryId: string;
  readonly timestamp: Date;

  constructor(public readonly paymentId: string) {
    this.queryId = `get-payment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.timestamp = new Date();
  }
}
