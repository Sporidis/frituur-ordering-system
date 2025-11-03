import { Injectable } from '@nestjs/common';
import { PaymentApplicationService } from '../payment-application.service';
import { CreatePaymentIntentDto } from '../../presentation/dto/create-payment-intent.dto';

@Injectable()
export class CreatePaymentIntentUseCase {
  constructor(private readonly app: PaymentApplicationService) {}

  execute(dto: CreatePaymentIntentDto) {
    return this.app.createPaymentIntent(dto);
  }
}
