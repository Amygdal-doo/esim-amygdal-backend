import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsEnum } from 'class-validator';
import { MonriCurrency } from '@prisma/client';

export class InitializePaymentDto {
  // @ApiProperty({ description: 'Package data', type: PackageRequestDto })
  // @ValidateNested()
  // @Type(() => PackageRequestDto)
  // packages: PackageRequestDto;

  @ApiProperty({ description: 'Quantity', example: '6.00' })
  @IsDecimal({
    decimal_digits: '0,2',
  })
  price: string;

  @ApiProperty({
    description: 'Currency',
    example: MonriCurrency.USD,
    enum: MonriCurrency,
  })
  @IsEnum(MonriCurrency)
  currency: MonriCurrency;
}
