import { Controller, Post, Get, Body, Param, Logger } from '@nestjs/common';
import { PaymentService } from './payment.service';

interface CreatePaymentIntentDto {
  amount: number;
  currency?: string;
  orderId?: string;
  customerName?: string;
}

interface ConfirmPaymentDto {
  paymentIntentId: string;
  paymentMethodId: string;
}

interface RefundDto {
  paymentIntentId: string;
  amount?: number;
}

@Controller('payments')
export class PaymentController {
  private logger: Logger = new Logger('PaymentController');

  constructor(private paymentService: PaymentService) {}

  @Post('create-intent')
  async createPaymentIntent(@Body() createPaymentDto: CreatePaymentIntentDto) {
    try {
      const {
        amount,
        currency = 'eur',
        orderId,
        customerName,
      } = createPaymentDto;

      if (!amount || amount <= 0) {
        return {
          success: false,
          error: 'Invalid amount. Amount must be greater than 0.',
        };
      }

      const metadata = {
        orderId: orderId || '',
        customerName: customerName || '',
        timestamp: new Date().toISOString(),
      };

      const paymentIntent = await this.paymentService.createPaymentIntent(
        amount,
        currency,
        metadata,
      );

      return {
        success: true,
        paymentIntent: {
          id: paymentIntent.id,
          clientSecret: paymentIntent.client_secret,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: paymentIntent.status,
        },
      };
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
      const paymentIntent = await this.paymentService.getPaymentIntent(id);

      return {
        success: true,
        paymentIntent: {
          id: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: paymentIntent.status,
          metadata: paymentIntent.metadata,
        },
      };
    } catch (error) {
      this.logger.error('Error retrieving payment intent:', error);
      return {
        success: false,
        error: error.message || 'Failed to retrieve payment intent',
      };
    }
  }

  @Post('confirm')
  async confirmPayment(@Body() confirmPaymentDto: ConfirmPaymentDto) {
    try {
      const { paymentIntentId, paymentMethodId } = confirmPaymentDto;

      if (!paymentIntentId || !paymentMethodId) {
        return {
          success: false,
          error: 'Payment intent ID and payment method ID are required.',
        };
      }

      const paymentIntent = await this.paymentService.confirmPaymentIntent(
        paymentIntentId,
        paymentMethodId,
      );

      return {
        success: true,
        paymentIntent: {
          id: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
        },
      };
    } catch (error) {
      this.logger.error('Error confirming payment:', error);
      return {
        success: false,
        error: error.message || 'Failed to confirm payment',
      };
    }
  }

  @Post('cancel/:id')
  async cancelPayment(@Param('id') id: string) {
    try {
      const paymentIntent = await this.paymentService.cancelPaymentIntent(id);

      return {
        success: true,
        paymentIntent: {
          id: paymentIntent.id,
          status: paymentIntent.status,
        },
      };
    } catch (error) {
      this.logger.error('Error cancelling payment:', error);
      return {
        success: false,
        error: error.message || 'Failed to cancel payment',
      };
    }
  }

  @Post('refund')
  async createRefund(@Body() refundDto: RefundDto) {
    try {
      const { paymentIntentId, amount } = refundDto;

      if (!paymentIntentId) {
        return {
          success: false,
          error: 'Payment intent ID is required.',
        };
      }

      const refund = await this.paymentService.createRefund(
        paymentIntentId,
        amount,
      );

      return {
        success: true,
        refund: {
          id: refund.id,
          amount: refund.amount,
          status: refund.status,
          paymentIntentId: refund.payment_intent,
        },
      };
    } catch (error) {
      this.logger.error('Error creating refund:', error);
      return {
        success: false,
        error: error.message || 'Failed to create refund',
      };
    }
  }

  // Get publishable key for frontend
  @Get('config')
  async getPaymentConfig() {
    return {
      success: true,
      publishableKey:
        process.env.STRIPE_PUBLISHABLE_KEY ||
        '',
    };
  }

  @Post('demo/create-test-payment')
  async createTestPayment() {
    try {
      const testAmount = 19.99;
      const testOrderId = 'DEMO_ORDER_001';
      const testCustomerName = 'Test Customer';

      const paymentIntent = await this.paymentService.createPaymentIntent(
        testAmount,
        'eur',
        {
          orderId: testOrderId,
          customerName: testCustomerName,
          isDemo: 'true',
        },
      );

      return {
        success: true,
        message: 'Test payment intent created successfully',
        paymentIntent: {
          id: paymentIntent.id,
          clientSecret: paymentIntent.client_secret,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: paymentIntent.status,
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
}
