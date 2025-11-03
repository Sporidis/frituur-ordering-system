import { Module } from '@nestjs/common';
import { PAYMENT_NEST_CONTROLLERS } from './presentation/http/controllers';
import { PaymentApplicationService } from './application/payment-application.service';
import { InMemoryPaymentRepository } from './infrastructure/payment-repository.impl';
import { StripePaymentGateway } from './infrastructure/stripe-payment-gateway';
import { PAYMENT_HTTP_ENDPOINTS } from './presentation/http/endpoints';
import { CreatePaymentIntentController } from './presentation/controllers/create-payment-intent.controller';
import { CreateRefundController } from './presentation/controllers/create-refund.controller';
import { PAYMENT_USE_CASES } from './application/use-cases';

@Module({
  controllers: [...PAYMENT_NEST_CONTROLLERS],
  providers: [
    PaymentApplicationService,
    StripePaymentGateway,
    { provide: 'IPaymentRepository', useClass: InMemoryPaymentRepository },
    ...PAYMENT_USE_CASES,
    CreatePaymentIntentController,
    CreateRefundController,
    ...PAYMENT_HTTP_ENDPOINTS,
  ],
  exports: [PaymentApplicationService, 'IPaymentRepository'],
})
export class PaymentsModule {}
