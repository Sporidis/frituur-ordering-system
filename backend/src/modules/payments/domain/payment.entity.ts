import { BaseEntity } from '@shared/domain/entities/base-entity';
import { Money } from '@shared/domain/value-objects/money';
import { PaymentStatus } from './payment-status.enum';
import { PaymentMethod } from './payment-method.enum';

/**
 * Payment domain entity
 * Represents a payment in the system
 */
export class Payment extends BaseEntity {
  private _amount: Money;
  private _status: PaymentStatus;
  private _paymentMethod: PaymentMethod;
  private _customerId: string;
  private _orderId: string;
  private _stripePaymentIntentId?: string;
  private _stripeChargeId?: string;
  private _failureReason?: string;
  private _metadata: Record<string, any>;

  constructor(
    amount: Money,
    customerId: string,
    orderId: string,
    paymentMethod: PaymentMethod = PaymentMethod.CARD,
    id?: string,
  ) {
    super(id);
    this._amount = amount;
    this._customerId = customerId;
    this._orderId = orderId;
    this._paymentMethod = paymentMethod;
    this._status = PaymentStatus.PENDING;
    this._metadata = {};
  }

  get amount(): Money {
    return this._amount;
  }

  get status(): PaymentStatus {
    return this._status;
  }

  get paymentMethod(): PaymentMethod {
    return this._paymentMethod;
  }

  get customerId(): string {
    return this._customerId;
  }

  get orderId(): string {
    return this._orderId;
  }

  get stripePaymentIntentId(): string | undefined {
    return this._stripePaymentIntentId;
  }

  get stripeChargeId(): string | undefined {
    return this._stripeChargeId;
  }

  get failureReason(): string | undefined {
    return this._failureReason;
  }

  get metadata(): Record<string, any> {
    return { ...this._metadata };
  }

  /**
   * Mark payment as processing
   */
  markAsProcessing(stripePaymentIntentId: string): void {
    if (this._status !== PaymentStatus.PENDING) {
      throw new Error(
        `Cannot mark payment as processing. Current status: ${this._status}`,
      );
    }

    this._status = PaymentStatus.PROCESSING;
    this._stripePaymentIntentId = stripePaymentIntentId;
    this.markAsUpdated();
  }

  /**
   * Mark payment as succeeded
   */
  markAsSucceeded(stripeChargeId: string): void {
    if (this._status !== PaymentStatus.PROCESSING) {
      throw new Error(
        `Cannot mark payment as succeeded. Current status: ${this._status}`,
      );
    }

    this._status = PaymentStatus.SUCCEEDED;
    this._stripeChargeId = stripeChargeId;
    this.markAsUpdated();
  }

  /**
   * Mark payment as failed
   */
  markAsFailed(reason: string): void {
    if (this._status === PaymentStatus.SUCCEEDED) {
      throw new Error('Cannot mark a succeeded payment as failed');
    }

    this._status = PaymentStatus.FAILED;
    this._failureReason = reason;
    this.markAsUpdated();
  }

  /**
   * Mark payment as cancelled
   */
  markAsCancelled(): void {
    if (this._status === PaymentStatus.SUCCEEDED) {
      throw new Error('Cannot cancel a succeeded payment');
    }

    this._status = PaymentStatus.CANCELLED;
    this.markAsUpdated();
  }

  /**
   * Add metadata to the payment
   */
  addMetadata(key: string, value: any): void {
    this._metadata[key] = value;
    this.markAsUpdated();
  }

  /**
   * Update metadata (merge with existing metadata)
   */
  updateMetadata(metadata: Record<string, any>): void {
    this._metadata = { ...this._metadata, ...metadata };
    this.markAsUpdated();
  }

  /**
   * Check if payment is in a final state
   */
  isFinal(): boolean {
    return [
      PaymentStatus.SUCCEEDED,
      PaymentStatus.FAILED,
      PaymentStatus.CANCELLED,
    ].includes(this._status);
  }

  /**
   * Check if payment can be refunded
   */
  canBeRefunded(): boolean {
    return this._status === PaymentStatus.SUCCEEDED;
  }
}
