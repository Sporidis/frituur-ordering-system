import { Module } from '@nestjs/common';
import { PAYMENT_NEST_CONTROLLERS } from './presentation/http/controllers';
import { InMemoryPaymentRepository } from './infrastructure/payment-repository.impl';
import { StripePaymentGateway } from './infrastructure/stripe-payment-gateway';
import { PAYMENT_HTTP_ENDPOINTS } from './presentation/http/endpoints';
import { PAYMENT_REPOSITORY } from './domain/payment-repository.interface';
import { PAYMENT_GATEWAY } from './domain/ports/payment-gateway.port';

@Module({
  controllers: [...PAYMENT_NEST_CONTROLLERS],
  providers: [
    StripePaymentGateway,
    { provide: PAYMENT_REPOSITORY, useClass: InMemoryPaymentRepository },
    { provide: PAYMENT_GATEWAY, useExisting: StripePaymentGateway },
    ...PAYMENT_HTTP_ENDPOINTS,
  ],
  exports: [PAYMENT_REPOSITORY, PAYMENT_GATEWAY],
})
export class PaymentsModule {}
