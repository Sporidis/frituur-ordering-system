import { Injectable } from '@nestjs/common';
import type { IPaymentRepository } from '@modules/payments/domain/payment-repository.interface';
import { Payment } from '@modules/payments/domain/payment.entity';

/**
 * In-memory implementation of payment repository
 * In a real application, this would use a database
 */
@Injectable()
export class InMemoryPaymentRepository implements IPaymentRepository {
  private payments: Map<string, Payment> = new Map();

  async findById(id: string): Promise<Payment | null> {
    return this.payments.get(id) || null;
  }

  async findAll(): Promise<Payment[]> {
    return Array.from(this.payments.values());
  }

  async findMany(limit: number, offset: number): Promise<Payment[]> {
    const allPayments = Array.from(this.payments.values());
    return allPayments.slice(offset, offset + limit);
  }

  async save(payment: Payment): Promise<Payment> {
    this.payments.set(payment.id, payment);
    return payment;
  }

  async delete(id: string): Promise<boolean> {
    return this.payments.delete(id);
  }

  async exists(id: string): Promise<boolean> {
    return this.payments.has(id);
  }

  async count(): Promise<number> {
    return this.payments.size;
  }

  async findByCustomerId(customerId: string): Promise<Payment[]> {
    return Array.from(this.payments.values()).filter(
      (payment) => payment.customerId === customerId,
    );
  }

  async findByOrderId(orderId: string): Promise<Payment[]> {
    return Array.from(this.payments.values()).filter(
      (payment) => payment.orderId === orderId,
    );
  }

  async findByStatus(status: string): Promise<Payment[]> {
    return Array.from(this.payments.values()).filter(
      (payment) => payment.status === status,
    );
  }

  async findByStripePaymentIntentId(
    paymentIntentId: string,
  ): Promise<Payment | null> {
    return (
      Array.from(this.payments.values()).find(
        (payment) => payment.stripePaymentIntentId === paymentIntentId,
      ) || null
    );
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Payment[]> {
    return Array.from(this.payments.values()).filter(
      (payment) =>
        payment.createdAt >= startDate && payment.createdAt <= endDate,
    );
  }
}
