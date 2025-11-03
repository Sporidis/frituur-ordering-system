import { IsNumber, IsString, IsOptional, IsObject, Min } from 'class-validator';

/**
 * DTO for creating a payment intent
 */
export class CreatePaymentIntentDto {
  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsString()
  currency: string = 'EUR';

  @IsString()
  customerId: string;

  @IsString()
  orderId: string;

  @IsOptional()
  @IsString()
  paymentMethod?: string = 'card';

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
