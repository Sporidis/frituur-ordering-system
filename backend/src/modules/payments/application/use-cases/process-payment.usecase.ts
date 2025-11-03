import { Injectable } from '@nestjs/common';
import { PaymentApplicationService } from '../payment-application.service';
import { ProcessPaymentDto } from '../../presentation/dto/process-payment.dto';
import { UseCase } from '../../../../shared/application/usecase.interface';

@Injectable()
export class ProcessPaymentUseCase implements UseCase<ProcessPaymentDto, any> {
  constructor(private readonly app: PaymentApplicationService) {}

  execute(dto: ProcessPaymentDto) {
    return this.app.processPayment(dto);
  }
}
