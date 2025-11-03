import { Inject, Injectable, Logger } from '@nestjs/common';
import { UseCase } from '@shared/application/usecase.interface';
import {
  PAYMENT_REPOSITORY,
  type IPaymentRepository,
} from '@modules/payments/domain/payment-repository.interface';
import {
  PAYMENT_GATEWAY,
  type PaymentGatewayPort,
} from '@modules/payments/domain/ports/payment-gateway.port';

@Injectable()
export class HandleWebhookUseCase
  implements UseCase<{ rawBody: Buffer; signature: string }, any>
{
  private readonly logger = new Logger(HandleWebhookUseCase.name);

  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: IPaymentRepository,
    @Inject(PAYMENT_GATEWAY)
    private readonly paymentGateway: PaymentGatewayPort,
  ) {}

  async execute(input: { rawBody: Buffer; signature: string }) {
    const event = await this.paymentGateway.constructWebhookEvent(
      input.rawBody,
      input.signature,
    );

    this.logger.log(`Processing webhook event: ${event.type}`);

    const payments = await this.paymentRepository.findAll();

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const payment = payments.find(
          (p) => p.stripePaymentIntentId === event.data.object.id,
        );
        if (payment) {
          payment.markAsSucceeded(event.data.object.id);
          await this.paymentRepository.save(payment);
          this.logger.log(
            `Updated payment ${payment.id} status to succeeded via webhook`,
          );
        }
        break;
      }
      case 'payment_intent.payment_failed': {
        const payment = payments.find(
          (p) => p.stripePaymentIntentId === event.data.object.id,
        );
        if (payment) {
          payment.markAsFailed(
            `Payment failed: ${event.data.object.last_payment_error?.message || 'Unknown error'}`,
          );
          await this.paymentRepository.save(payment);
          this.logger.log(
            `Updated payment ${payment.id} status to failed via webhook`,
          );
        }
        break;
      }
      case 'payment_intent.canceled': {
        const payment = payments.find(
          (p) => p.stripePaymentIntentId === event.data.object.id,
        );
        if (payment) {
          payment.markAsCancelled();
          await this.paymentRepository.save(payment);
          this.logger.log(
            `Updated payment ${payment.id} status to cancelled via webhook`,
          );
        }
        break;
      }
      default:
        this.logger.log(`Unhandled event type: ${event.type}`);
    }

    return {
      eventType: event.type,
      processed: true,
    };
  }
}
