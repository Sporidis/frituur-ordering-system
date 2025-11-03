import { Injectable } from '@nestjs/common';
import { PaymentApplicationService } from '../payment-application.service';

@Injectable()
export class CreateRefundUseCase {
  constructor(private readonly app: PaymentApplicationService) {}

  execute(paymentIntentId: string, amount?: number, reason?: string) {
    return this.app.createRefund(paymentIntentId, amount, reason);
  }
}
