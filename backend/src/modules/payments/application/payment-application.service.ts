import { Inject, Injectable, Logger } from '@nestjs/common';
import { Money } from '@shared/domain/value-objects/money';
import { PaymentMethod } from '@modules/payments/domain/payment-method.enum';
import { Payment } from '@modules/payments/domain/payment.entity';
import type { IPaymentRepository } from '@modules/payments/domain/payment-repository.interface';
import { StripePaymentGateway } from '@modules/payments/infrastructure/stripe-payment-gateway';
import { CreatePaymentIntentDto } from '../presentation/dto/create-payment-intent.dto';
import { ProcessPaymentDto } from '../presentation/dto/process-payment.dto';

/**
 * Payment application service
 * Orchestrates payment operations and coordinates between domain and infrastructure layers
 */
@Injectable()
export class PaymentApplicationService {
  private readonly logger = new Logger(PaymentApplicationService.name);

  constructor(
    @Inject('IPaymentRepository')
    private readonly paymentRepository: IPaymentRepository,
    private readonly stripeGateway: StripePaymentGateway,
  ) {}

  /**
   * Create a payment intent
   */
  async createPaymentIntent(dto: CreatePaymentIntentDto): Promise<{
    paymentId: string;
    paymentIntentId: string;
    clientSecret: string;
  }> {
    try {
      // Create domain objects
      const amount = new Money(dto.amount, dto.currency);
      const paymentMethod = dto.paymentMethod as PaymentMethod;

      // Create payment entity
      const payment = new Payment(
        amount,
        dto.customerId,
        dto.orderId,
        paymentMethod,
      );

      // Add metadata if provided
      if (dto.metadata) {
        Object.entries(dto.metadata).forEach(([key, value]) => {
          payment.addMetadata(key, value);
        });
      }

      // Create payment intent with Stripe
      const stripeResult = await this.stripeGateway.createPaymentIntent(
        amount,
        dto.customerId,
        dto.orderId,
        dto.metadata,
      );

      // Update payment with Stripe payment intent ID
      payment.markAsProcessing(stripeResult.paymentIntentId);

      // Save payment
      await this.paymentRepository.save(payment);

      this.logger.log(`Created payment intent: ${payment.id}`);

      return {
        paymentId: payment.id,
        paymentIntentId: stripeResult.paymentIntentId,
        clientSecret: stripeResult.clientSecret,
      };
    } catch (error) {
      this.logger.error('Error creating payment intent:', error);
      throw error;
    }
  }

  /**
   * Get a payment by ID
   */
  async getPayment(paymentId: string): Promise<Payment | null> {
    try {
      return await this.paymentRepository.findById(paymentId);
    } catch (error) {
      this.logger.error('Error getting payment:', error);
      throw error;
    }
  }

  /**
   * Process a payment
   */
  async processPayment(dto: ProcessPaymentDto): Promise<{
    paymentId: string;
    status: string;
    amount: number;
    currency: string;
  }> {
    try {
      // Get payment
      const payment = await this.paymentRepository.findById(dto.paymentId);
      if (!payment) {
        throw new Error('Payment not found');
      }

      if (!payment.stripePaymentIntentId) {
        throw new Error('Payment intent not found');
      }

      // Confirm payment with Stripe
      const stripeResult = await this.stripeGateway.confirmPaymentIntent(
        payment.stripePaymentIntentId,
        dto.paymentMethodId,
      );

      // Update payment status based on Stripe result
      if (stripeResult.status === 'succeeded') {
        payment.markAsSucceeded(stripeResult.chargeId!);
      } else if (stripeResult.status === 'requires_action') {
        // Payment requires additional action (e.g., 3D Secure)
        // Keep as processing for now
      } else {
        payment.markAsFailed(
          `Payment failed with status: ${stripeResult.status}`,
        );
      }

      // Save updated payment
      await this.paymentRepository.save(payment);

      this.logger.log(`Processed payment: ${payment.id}`);

      return {
        paymentId: payment.id,
        status: payment.status,
        amount: payment.amount.amount,
        currency: payment.amount.currency,
      };
    } catch (error) {
      this.logger.error('Error processing payment:', error);
      throw error;
    }
  }

  /**
   * Cancel a payment
   */
  async cancelPayment(paymentId: string): Promise<void> {
    try {
      const payment = await this.paymentRepository.findById(paymentId);
      if (!payment) {
        throw new Error('Payment not found');
      }

      if (payment.stripePaymentIntentId) {
        await this.stripeGateway.cancelPaymentIntent(
          payment.stripePaymentIntentId,
        );
      }

      payment.markAsCancelled();
      await this.paymentRepository.save(payment);

      this.logger.log(`Cancelled payment: ${payment.id}`);
    } catch (error) {
      this.logger.error('Error cancelling payment:', error);
      throw error;
    }
  }

  /**
   * Create a demo payment for testing
   */
  async createDemoPayment(): Promise<{
    paymentId: string;
    paymentIntentId: string;
    clientSecret: string;
  }> {
    const demoDto: CreatePaymentIntentDto = {
      amount: 10.5,
      currency: 'EUR',
      customerId: 'demo-customer-001',
      orderId: 'DEMO_ORDER_001',
      paymentMethod: 'card',
      metadata: {
        isDemo: true,
        customerName: 'Demo Customer',
      },
    };

    return this.createPaymentIntent(demoDto);
  }

  /**
   * Create a refund for a payment
   */
  async createRefund(
    paymentIntentId: string,
    amount?: number,
    reason?: string,
  ): Promise<{ refundId: string; status: string }> {
    try {
      // Find the payment by Stripe payment intent ID
      const payments = await this.paymentRepository.findAll();
      const payment = payments.find(
        (p) => p.stripePaymentIntentId === paymentIntentId,
      );

      if (!payment) {
        throw new Error('Payment not found');
      }

      if (!payment.canBeRefunded()) {
        throw new Error(
          `Payment cannot be refunded. Current status: ${payment.status}`,
        );
      }

      // Create refund with Stripe
      const refundResult = await this.stripeGateway.createRefund(
        paymentIntentId,
        amount ? new Money(amount, payment.amount.currency) : undefined,
      );

      this.logger.log(
        `Created refund: ${refundResult.refundId} for payment: ${payment.id}`,
      );

      return refundResult;
    } catch (error) {
      this.logger.error('Error creating refund:', error);
      throw error;
    }
  }

  /**
   * Sync payment status with Stripe by PaymentIntent ID.
   * Useful when webhooks are not running in development.
   */
  async syncStatusByStripePaymentIntent(
    paymentIntentId: string,
  ): Promise<{ paymentId: string; status: string }> {
    // Find local payment
    const payments = await this.paymentRepository.findAll();
    const payment = payments.find(
      (p) => p.stripePaymentIntentId === paymentIntentId,
    );
    if (!payment) {
      throw new Error('Payment not found');
    }

    const intent = await this.stripeGateway.getPaymentIntent(paymentIntentId);
    const status = intent.status as string;

    if (status === 'succeeded') {
      payment.markAsSucceeded(intent.latest_charge);
    } else if (status === 'canceled') {
      payment.markAsCancelled();
    } else if (status === 'requires_payment_method') {
      payment.markAsFailed('requires_payment_method');
    } // keep other states as-is (processing/requires_action)

    await this.paymentRepository.save(payment);

    return { paymentId: payment.id, status: payment.status };
  }

  /**
   * Handle Stripe webhook events
   */
  async handleWebhook(
    rawBody: Buffer,
    signature: string,
  ): Promise<{ eventType: string; processed: boolean }> {
    try {
      const event = await this.stripeGateway.constructWebhookEvent(
        rawBody,
        signature,
      );

      this.logger.log(`Processing webhook event: ${event.type}`);

      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSucceeded(event.data.object);
          break;
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailed(event.data.object);
          break;
        case 'payment_intent.canceled':
          await this.handlePaymentCanceled(event.data.object);
          break;
        default:
          this.logger.log(`Unhandled event type: ${event.type}`);
      }

      return {
        eventType: event.type,
        processed: true,
      };
    } catch (error) {
      this.logger.error('Error processing webhook:', error);
      throw error;
    }
  }

  /**
   * Handle payment succeeded webhook
   */
  private async handlePaymentSucceeded(paymentIntent: any): Promise<void> {
    try {
      const payments = await this.paymentRepository.findAll();
      const payment = payments.find(
        (p) => p.stripePaymentIntentId === paymentIntent.id,
      );

      if (payment) {
        payment.markAsSucceeded(paymentIntent.latest_charge);
        await this.paymentRepository.save(payment);
        this.logger.log(
          `Updated payment ${payment.id} status to succeeded via webhook`,
        );
      }
    } catch (error) {
      this.logger.error('Error handling payment succeeded webhook:', error);
    }
  }

  /**
   * Handle payment failed webhook
   */
  private async handlePaymentFailed(paymentIntent: any): Promise<void> {
    try {
      const payments = await this.paymentRepository.findAll();
      const payment = payments.find(
        (p) => p.stripePaymentIntentId === paymentIntent.id,
      );

      if (payment) {
        payment.markAsFailed(
          `Payment failed: ${paymentIntent.last_payment_error?.message || 'Unknown error'}`,
        );
        await this.paymentRepository.save(payment);
        this.logger.log(
          `Updated payment ${payment.id} status to failed via webhook`,
        );
      }
    } catch (error) {
      this.logger.error('Error handling payment failed webhook:', error);
    }
  }

  /**
   * Handle payment canceled webhook
   */
  private async handlePaymentCanceled(paymentIntent: any): Promise<void> {
    try {
      const payments = await this.paymentRepository.findAll();
      const payment = payments.find(
        (p) => p.stripePaymentIntentId === paymentIntent.id,
      );

      if (payment) {
        payment.markAsCancelled();
        await this.paymentRepository.save(payment);
        this.logger.log(
          `Updated payment ${payment.id} status to cancelled via webhook`,
        );
      }
    } catch (error) {
      this.logger.error('Error handling payment canceled webhook:', error);
    }
  }
}
