import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateOrderItemDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  @IsPositive()
  price!: number;

  @IsNumber()
  @Min(1)
  quantity!: number;
}

export class CreateOrderHttpRequest {
  @IsString()
  @IsNotEmpty()
  customerName!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items!: CreateOrderItemDto[];
}
