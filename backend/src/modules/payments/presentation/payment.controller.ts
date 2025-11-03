import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Logger,
  Headers,
  Req,
  Query,
  Header,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { PaymentApplicationService } from '../application/payment-application.service';
import { CreatePaymentIntentEndpoint } from './http/endpoints/create-payment-intent.endpoint';
import { CreateRefundEndpoint } from './http/endpoints/create-refund.endpoint';
import { GetPaymentIntentEndpoint } from './http/endpoints/get-payment-intent.endpoint';
import { ProcessPaymentEndpoint } from './http/endpoints/process-payment.endpoint';
import { HandleWebhookEndpoint } from './http/endpoints/handle-webhook.endpoint';
import { SyncStatusEndpoint } from './http/endpoints/sync-status.endpoint';
import { GetConfigEndpoint } from './http/endpoints/get-config.endpoint';
import { GetElementsPageEndpoint } from './http/endpoints/get-elements-page.endpoint';
import { GetReturnPageEndpoint } from './http/endpoints/get-return-page.endpoint';
import type { Request } from 'express';
import { renderElementsPage, renderReturnPage } from './views/elements.page';

/**
 * Payment controller - handles HTTP requests for payment operations
 * This is the presentation layer of the payments module
 */
@Controller('payments')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(
    private readonly paymentApplicationService: PaymentApplicationService,
    private readonly createPaymentIntentEndpoint: CreatePaymentIntentEndpoint,
    private readonly createRefundEndpoint: CreateRefundEndpoint,
    private readonly getPaymentIntentEndpoint: GetPaymentIntentEndpoint,
    private readonly processPaymentEndpoint: ProcessPaymentEndpoint,
    private readonly handleWebhookEndpoint: HandleWebhookEndpoint,
    private readonly syncStatusEndpoint: SyncStatusEndpoint,
    private readonly getConfigEndpoint: GetConfigEndpoint,
    private readonly getElementsPageEndpoint: GetElementsPageEndpoint,
    private readonly getReturnPageEndpoint: GetReturnPageEndpoint,
  ) {}

  @Post('create-intent')
  async createPaymentIntent(@Body() createPaymentDto: CreatePaymentIntentDto) {
    try {
      return await this.createPaymentIntentEndpoint.handle(createPaymentDto);
    } catch (error) {
      this.logger.error('Error creating payment intent:', error);
      return {
        success: false,
        error: error.message || 'Failed to create payment intent',
      };
    }
  }

  @Get('intent/:id')
  async getPaymentIntent(@Param('id') id: string) {
    try {
      return await this.getPaymentIntentEndpoint.handle(id);
    } catch (error) {
      this.logger.error('Error retrieving payment intent:', error);
      return {
        success: false,
        error: error.message || 'Failed to retrieve payment intent',
      };
    }
  }

  @Post('process')
  async processPayment(@Body() processPaymentDto: ProcessPaymentDto) {
    try {
      return await this.processPaymentEndpoint.handle(processPaymentDto);
    } catch (error) {
      this.logger.error('Error processing payment:', error);
      return {
        success: false,
        error: error.message || 'Failed to process payment',
      };
    }
  }

  @Post('cancel/:id')
  async cancelPayment(@Param('id') id: string) {
    try {
      await this.paymentApplicationService.cancelPayment(id);

      return {
        success: true,
        message: 'Payment cancelled successfully',
      };
    } catch (error) {
      this.logger.error('Error cancelling payment:', error);
      return {
        success: false,
        error: error.message || 'Failed to cancel payment',
      };
    }
  }

  @Get('config')
  async getPaymentConfig() {
    return this.getConfigEndpoint.handle();
  }

  @Post('demo/create-test-payment')
  async createTestPayment() {
    try {
      const result = await this.paymentApplicationService.createDemoPayment();

      return {
        success: true,
        message: 'Test payment intent created successfully',
        paymentIntent: {
          id: result.paymentIntentId,
          clientSecret: result.clientSecret,
          amount: 10.5,
          currency: 'EUR',
          status: 'requires_payment_method',
          stripePaymentIntentId: result.paymentIntentId,
        },
      };
    } catch (error) {
      this.logger.error('Error creating test payment:', error);
      return {
        success: false,
        error: error.message || 'Failed to create test payment',
      };
    }
  }

  @Post('refund')
  async createRefund(
    @Body()
    refundDto: {
      paymentIntentId: string;
      amount?: number;
      reason?: string;
    },
  ) {
    try {
      return await this.createRefundEndpoint.handle(refundDto);
    } catch (error) {
      this.logger.error('Error creating refund:', error);
      return {
        success: false,
        error: error.message || 'Failed to create refund',
      };
    }
  }

  @Post('webhook')
  async handleStripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    try {
      return await this.handleWebhookEndpoint.handle(req.rawBody!, signature);
    } catch (error) {
      this.logger.error('Error processing webhook:', error);
      return {
        success: false,
        error: error.message || 'Failed to process webhook',
      };
    }
  }

  @Post('sync-status')
  async syncStatus(@Body() body: { paymentIntentId: string }) {
    try {
      return await this.syncStatusEndpoint.handle(body.paymentIntentId);
    } catch (error) {
      this.logger.error('Error syncing status:', error);
      return {
        success: false,
        error: error.message || 'Failed to sync status',
      };
    }
  }

  /**
   * Serves a minimal Stripe Elements page over HTTP so that desktop WebView2
   * can load it with a proper origin (avoids sandboxed data: URLs).
   *
   * Note: This is intended for PoC/demo usage only.
   */
  @Get('elements')
  @Header('Content-Type', 'text/html; charset=utf-8')
  @Header('Cache-Control', 'no-store')
  async getStripeElementsPage(
    @Query('client_secret') clientSecret?: string,
    @Query('publishable_key') publishableKey?: string,
  ): Promise<string> {
    return this.getElementsPageEndpoint.handle(clientSecret, publishableKey);
  }

  @Get('return')
  @Header('Content-Type', 'text/html; charset=utf-8')
  @Header('Cache-Control', 'no-store')
  async handleStripeReturn(
    @Query('publishable_key') publishableKey?: string,
  ): Promise<string> {
    return this.getReturnPageEndpoint.handle(publishableKey);
  }
}
