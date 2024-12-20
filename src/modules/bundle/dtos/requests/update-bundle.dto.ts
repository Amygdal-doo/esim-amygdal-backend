import { ApiPropertyOptional } from '@nestjs/swagger';
import { MonriCurrency, Prisma } from '@prisma/client';
import {
  IsBoolean,
  IsDecimal,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateBundleDto implements Prisma.CreditBundleUpdateInput {
  @ApiPropertyOptional({
    description: 'Price of the credit bundle',
    example: '100.00',
  })
  @IsDecimal({
    decimal_digits: '0,2',
  })
  @IsOptional()
  price: string;

  @ApiPropertyOptional({
    description: 'Currency of the credit bundle',
    example: MonriCurrency.USD,
    enum: MonriCurrency,
  })
  @IsEnum(MonriCurrency)
  @IsOptional()
  currency: MonriCurrency;

  @ApiPropertyOptional({
    description: 'Number of credits in the bundle',
    example: 100,
  })
  @IsNumber()
  @IsOptional()
  credits: number;

  @ApiPropertyOptional({
    description: 'Indicates if the credit bundle is active',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Title of the credit bundle',
    example: '100 credits',
  })
  @IsString()
  @IsOptional()
  title: string;
}
