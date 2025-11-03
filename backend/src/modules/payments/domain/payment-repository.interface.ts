import type { IRepository } from '@shared/domain/interfaces/repository.interface';
import { Payment } from './payment.entity';

export const PAYMENT_REPOSITORY = 'PAYMENT_REPOSITORY';

export interface IPaymentRepository extends IRepository<Payment> {
  findByCustomerId(customerId: string): Promise<Payment[]>;
  findByOrderId(orderId: string): Promise<Payment[]>;
  findByStatus(status: string): Promise<Payment[]>;
  findByStripePaymentIntentId(paymentIntentId: string): Promise<Payment | null>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Payment[]>;
}
