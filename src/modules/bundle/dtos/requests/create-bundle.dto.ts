import { ApiProperty } from '@nestjs/swagger';
import { MonriCurrency, Prisma } from '@prisma/client';
import {
  IsDecimal,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsString,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateBundleDto implements Prisma.CreditBundleCreateInput {
  @ApiProperty({
    description: 'Price of the credit bundle',
    example: '100.00',
  })
  @IsDecimal({
    decimal_digits: '0,2',
  })
  @IsNotEmpty()
  price: string;

  @ApiProperty({
    description: 'Currency of the credit bundle',
    example: MonriCurrency.USD,
    enum: MonriCurrency,
  })
  @IsEnum(MonriCurrency)
  @IsNotEmpty()
  currency: MonriCurrency;

  @ApiProperty({
    description: 'Number of credits in the bundle',
    example: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  credits: number;

  @ApiProperty({
    description: 'Indicates if the credit bundle is active',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    description: 'Title of the credit bundle',
    example: '100 credits',
  })
  @IsString()
  @IsNotEmpty()
  title: string;
}
