import { IsString } from 'class-validator';

/**
 * DTO for processing a payment
 */
export class ProcessPaymentDto {
  @IsString()
  paymentId: string;

  @IsString()
  paymentMethodId: string;

  @IsString()
  customerName: string;
}
