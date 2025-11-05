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

export class QuoteItemDto {
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

export class QuoteOrderHttpRequest {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuoteItemDto)
  items!: QuoteItemDto[];
}
