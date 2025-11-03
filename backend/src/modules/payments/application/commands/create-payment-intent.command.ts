import { ICommand } from '@shared/application/commands/command.interface';
import { Money } from '@shared/domain/value-objects/money';
import { PaymentMethod } from '@modules/payments/domain/payment-method.enum';

/**
 * Command to create a payment intent
 */
export class CreatePaymentIntentCommand implements ICommand {
  readonly commandId: string;
  readonly timestamp: Date;

  constructor(
    public readonly amount: Money,
    public readonly customerId: string,
    public readonly orderId: string,
    public readonly paymentMethod: PaymentMethod = PaymentMethod.CARD,
    public readonly metadata?: Record<string, any>,
  ) {
    this.commandId = `create-payment-intent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.timestamp = new Date();
  }
}
