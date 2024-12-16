import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, ValidateNested } from 'class-validator';
import { CurrencyEnum } from '../../enums/currency.enum';
import { PackageRequestDto } from 'src/modules/airalo/dtos/requests/operator.request.dto';

export class InitializePaymentDto {
  @ApiProperty({ description: 'Package data', type: PackageRequestDto })
  @ValidateNested()
  @Type(() => PackageRequestDto)
  packages: PackageRequestDto;

  @ApiProperty({ description: 'Quantity', example: 1 })
  @IsNumber()
  quantity: number;

  @ApiProperty({
    description: 'Currency',
    example: CurrencyEnum.USD,
    enum: CurrencyEnum,
  })
  @IsEnum(CurrencyEnum)
  currency: CurrencyEnum;
}
