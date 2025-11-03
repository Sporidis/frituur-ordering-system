import { IQuery } from '@shared/application/queries/query.interface';

/**
 * Query to get payments by customer ID
 */
export class GetPaymentsByCustomerQuery implements IQuery {
  readonly queryId: string;
  readonly timestamp: Date;

  constructor(
    public readonly customerId: string,
    public readonly limit?: number,
    public readonly offset?: number,
  ) {
    this.queryId = `get-payments-by-customer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.timestamp = new Date();
  }
}
