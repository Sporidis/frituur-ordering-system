import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../../shared/application/usecase.interface';
import {
  PAYMENT_REPOSITORY,
  type IPaymentRepository,
} from '@modules/payments/domain/payment-repository.interface';

@Injectable()
export class GetPaymentUseCase implements UseCase<string, any> {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: IPaymentRepository,
  ) {}

  async execute(id: string) {
    return await this.paymentRepository.findById(id);
  }
}
