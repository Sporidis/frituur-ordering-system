import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { stripeConfig } from '@config/stripe.config';
import { Money } from '@shared/domain/value-objects/money';
import { PaymentGatewayPort } from '../domain/ports/payment-gateway.port';

/**
 * Stripe payment gateway implementation
 * Handles communication with Stripe API
 */
@Injectable()
export class StripePaymentGateway implements PaymentGatewayPort {
  private readonly logger = new Logger(StripePaymentGateway.name);
  private readonly stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(stripeConfig.secretKey, {
      apiVersion: stripeConfig.apiVersion,
    });
  }

  /**
   * Create a payment intent with Stripe
   */
  async createPaymentIntent(
    amount: Money,
    customerId: string,
    orderId: string,
    metadata?: Record<string, any>,
  ): Promise<{ paymentIntentId: string; clientSecret: string }> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amount.amountInCents,
        currency: amount.currency.toLowerCase(),
        metadata: {
          customerId,
          orderId,
          ...metadata,
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      this.logger.log(`Created Stripe payment intent: ${paymentIntent.id}`);

      return {
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret!,
      };
    } catch (error) {
      this.logger.error('Error creating Stripe payment intent:', error);
      throw new Error(`Failed to create payment intent: ${error.message}`);
    }
  }

  /**
   * Confirm a payment intent
   */
  async confirmPaymentIntent(
    paymentIntentId: string,
    paymentMethodId: string,
  ): Promise<{ success: boolean; status: string }> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.confirm(
        paymentIntentId,
        {
          payment_method: paymentMethodId,
        },
      );

      this.logger.log(`Confirmed Stripe payment intent: ${paymentIntentId}`);

      return {
        success: paymentIntent.status === 'succeeded',
        status: paymentIntent.status,
      };
    } catch (error) {
      this.logger.error('Error confirming Stripe payment intent:', error);
      throw new Error(`Failed to confirm payment: ${error.message}`);
    }
  }

  /**
   * Cancel a payment intent
   */
  async cancelPaymentIntent(paymentIntentId: string): Promise<boolean> {
    try {
      await this.stripe.paymentIntents.cancel(paymentIntentId);
      this.logger.log(`Cancelled Stripe payment intent: ${paymentIntentId}`);
      return true;
    } catch (error) {
      this.logger.error('Error cancelling Stripe payment intent:', error);
      throw new Error(`Failed to cancel payment: ${error.message}`);
    }
  }

  /**
   * Create a refund
   */
  async createRefund(
    paymentIntentId: string,
    amount?: number,
    reason?: string,
  ): Promise<{ refundId: string; status: string; amount?: number }> {
    try {
      // Build refund params - only include amount if provided (for partial refund)
      // If amount is undefined, Stripe will refund the full amount
      const refundParams: any = {
        payment_intent: paymentIntentId,
      };

      // If amount is provided, convert to cents and include it
      if (amount !== undefined && amount !== null) {
        // Amount should be in cents for Stripe
        refundParams.amount = Math.round(amount * 100);
      }

      // Only include reason if provided
      if (reason) {
        refundParams.reason = reason;
      }

      const refund = await this.stripe.refunds.create(refundParams);

      this.logger.log(`Created Stripe refund: ${refund.id}`);

      return {
        refundId: refund.id,
        status: refund.status || 'unknown',
        amount: refund.amount ? refund.amount / 100 : undefined, // Convert back to dollars
      };
    } catch (error) {
      this.logger.error('Error creating Stripe refund:', error);
      throw new Error(`Failed to create refund: ${error.message}`);
    }
  }

  /**
   * Get payment intent details
   */
  async getPaymentIntent(paymentIntentId: string): Promise<{
    id: string;
    status: string;
    amount: number;
    currency: string;
    metadata?: Record<string, any>;
  }> {
    try {
      const paymentIntent =
        await this.stripe.paymentIntents.retrieve(paymentIntentId);
      return {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        metadata: paymentIntent.metadata as Record<string, any>,
      };
    } catch (error) {
      this.logger.error('Error retrieving Stripe payment intent:', error);
      throw new Error(`Failed to retrieve payment intent: ${error.message}`);
    }
  }

  /**
   * Construct webhook event from raw body and signature
   */
  async constructWebhookEvent(
    rawBody: Buffer,
    signature: string,
  ): Promise<any> {
    try {
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      if (!webhookSecret) {
        throw new Error('Stripe webhook secret not configured');
      }

      const event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret,
      );

      this.logger.log(`Constructed webhook event: ${event.type}`);
      return event;
    } catch (error) {
      this.logger.error('Error constructing webhook event:', error);
      throw new Error(`Failed to construct webhook event: ${error.message}`);
    }
  }
}
