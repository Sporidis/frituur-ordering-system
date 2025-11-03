import { Controller, Param, Post } from '@nestjs/common';
import { CancelPaymentUseCase } from '@modules/payments/application/use-cases/cancel-payment.usecase';

@Controller('payments')
export class CancelPaymentHttpController {
  constructor(private readonly cancelPayment: CancelPaymentUseCase) {}

  @Post('cancel/:id')
  async handle(@Param('id') id: string) {
    await this.cancelPayment.execute(id);
    return { success: true, message: 'Payment cancelled successfully' };
  }
}
