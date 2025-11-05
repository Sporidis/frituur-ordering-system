import { Inject } from '@nestjs/common';
import { UseCase } from '@shared/application/usecase.interface';
import type { OutputPort } from '@shared/application/contracts/output-port.interface';
import {
  NotFoundException,
  ValidationException,
} from '@shared/application/exceptions/base.exception';
import {
  PAYMENT_REPOSITORY,
  type IPaymentRepository,
} from '@modules/payments/domain/payment-repository.interface';
import {
  PAYMENT_GATEWAY,
  type PaymentGatewayPort,
} from '@modules/payments/domain/ports/payment-gateway.port';

export interface CreateRefundRequest {
  paymentIntentId: string;
  amount?: number;
  reason?: string;
}

export interface CreateRefundResponse {
  refundId: string;
  status: string;
}

export class CreateRefundUseCase implements UseCase<CreateRefundRequest> {
  constructor(
    private readonly outputPort: OutputPort<CreateRefundResponse>,
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: IPaymentRepository,
    @Inject(PAYMENT_GATEWAY)
    private readonly paymentGateway: PaymentGatewayPort,
  ) {}

  async execute(input: CreateRefundRequest): Promise<void> {
    const payments = await this.paymentRepository.findAll();
    const payment = payments.find(
      (p) => p.stripePaymentIntentId === input.paymentIntentId,
    );
    if (!payment) {
      throw new NotFoundException('Payment', input.paymentIntentId);
    }
    if (!payment.canBeRefunded()) {
      throw new ValidationException(
        `Payment cannot be refunded. Current status: ${payment.status}`,
      );
    }

    const res = await this.paymentGateway.createRefund(
      input.paymentIntentId,
      input.amount,
      input.reason,
    );
    this.outputPort.present({ refundId: res.refundId, status: res.status });
  }
}
