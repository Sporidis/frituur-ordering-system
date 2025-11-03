import { ICommand } from '@shared/application/commands/command.interface';

/**
 * Command to process a payment
 */
export class ProcessPaymentCommand implements ICommand {
  readonly commandId: string;
  readonly timestamp: Date;

  constructor(
    public readonly paymentId: string,
    public readonly paymentMethodId: string,
    public readonly customerName: string,
  ) {
    this.commandId = `process-payment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.timestamp = new Date();
  }
}
