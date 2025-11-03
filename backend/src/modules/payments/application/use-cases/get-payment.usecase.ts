import { Injectable } from '@nestjs/common';
import { PaymentApplicationService } from '../payment-application.service';
import { UseCase } from '../../../../shared/application/usecase.interface';

@Injectable()
export class GetPaymentUseCase implements UseCase<string, any> {
  constructor(private readonly app: PaymentApplicationService) {}

  execute(id: string) {
    return this.app.getPayment(id);
  }
}
