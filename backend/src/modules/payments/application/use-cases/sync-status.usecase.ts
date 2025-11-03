import { Injectable } from '@nestjs/common';
import { PaymentApplicationService } from '../payment-application.service';
import { UseCase } from '../../../../shared/application/usecase.interface';

@Injectable()
export class SyncStatusUseCase implements UseCase<string, any> {
  constructor(private readonly app: PaymentApplicationService) {}

  execute(paymentIntentId: string) {
    return this.app.syncStatusByStripePaymentIntent(paymentIntentId);
  }
}
