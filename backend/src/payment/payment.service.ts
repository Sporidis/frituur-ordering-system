import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { stripeConfig } from '../config/stripe.config';

@Injectable()
export class PaymentService {
  private logger: Logger = new Logger('PaymentService');
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(stripeConfig.secretKey, {
      apiVersion: stripeConfig.apiVersion,
    });
  }

  async createPaymentIntent(
    amount: number,
    currency: string = 'eur',
    metadata?: any,
  ): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        metadata: metadata || {},
        automatic_payment_methods: {
          enabled: true,
        },
      });

      this.logger.log(`Created payment intent: ${paymentIntent.id}`);
      return paymentIntent;
    } catch (error) {
      this.logger.error('Error creating payment intent:', error);
      throw error;
    }
  }

  async getPaymentIntent(
    paymentIntentId: string,
  ): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent =
        await this.stripe.paymentIntents.retrieve(paymentIntentId);
      this.logger.log(`Retrieved payment intent: ${paymentIntentId}`);
      return paymentIntent;
    } catch (error) {
      this.logger.error('Error retrieving payment intent:', error);
      throw error;
    }
  }

  async confirmPaymentIntent(
    paymentIntentId: string,
    paymentMethodId: string,
  ): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.confirm(
        paymentIntentId,
        {
          payment_method: paymentMethodId,
        },
      );

      this.logger.log(`Confirmed payment intent: ${paymentIntentId}`);
      return paymentIntent;
    } catch (error) {
      this.logger.error('Error confirming payment intent:', error);
      throw error;
    }
  }

  async cancelPaymentIntent(
    paymentIntentId: string,
  ): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent =
        await this.stripe.paymentIntents.cancel(paymentIntentId);
      this.logger.log(`Cancelled payment intent: ${paymentIntentId}`);
      return paymentIntent;
    } catch (error) {
      this.logger.error('Error cancelling payment intent:', error);
      throw error;
    }
  }

  async createRefund(
    paymentIntentId: string,
    amount?: number,
  ): Promise<Stripe.Refund> {
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined, // Convert to cents if specified
      });

      this.logger.log(`Created refund for payment intent: ${paymentIntentId}`);
      return refund;
    } catch (error) {
      this.logger.error('Error creating refund:', error);
      throw error;
    }
  }
}
