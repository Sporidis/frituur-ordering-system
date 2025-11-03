import type { IRepository } from '@shared/domain/interfaces/repository.interface';
import { Payment } from './payment.entity';

/**
 * Payment repository interface
 * Defines the contract for payment data access
 */
export interface IPaymentRepository extends IRepository<Payment> {
  /**
   * Find payments by customer ID
   */
  findByCustomerId(customerId: string): Promise<Payment[]>;

  /**
   * Find payments by order ID
   */
  findByOrderId(orderId: string): Promise<Payment[]>;

  /**
   * Find payments by status
   */
  findByStatus(status: string): Promise<Payment[]>;

  /**
   * Find payment by Stripe payment intent ID
   */
  findByStripePaymentIntentId(paymentIntentId: string): Promise<Payment | null>;

  /**
   * Find payments within a date range
   */
  findByDateRange(startDate: Date, endDate: Date): Promise<Payment[]>;
}
