import { Inject, Logger } from '@nestjs/common';
import { UseCase } from '@shared/application/usecase.interface';
import type { OutputPort } from '@shared/application/contracts/output-port.interface';
import {
  PAYMENT_REPOSITORY,
  type IPaymentRepository,
} from '@modules/payments/domain/payment-repository.interface';
import {
  PAYMENT_GATEWAY,
  type PaymentGatewayPort,
} from '@modules/payments/domain/ports/payment-gateway.port';

export interface HandleWebhookRequest {
  rawBody: Buffer;
  signature: string;
}

export interface HandleWebhookResponse {
  eventType: string;
  processed: boolean;
}

export class HandleWebhookUseCase implements UseCase<HandleWebhookRequest> {
  private readonly logger = new Logger(HandleWebhookUseCase.name);

  constructor(
    private readonly outputPort: OutputPort<HandleWebhookResponse>,
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: IPaymentRepository,
    @Inject(PAYMENT_GATEWAY)
    private readonly paymentGateway: PaymentGatewayPort,
  ) {}

  async execute(input: HandleWebhookRequest): Promise<void> {
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

    this.outputPort.present({
      eventType: event.type,
      processed: true,
    });
  }
}
