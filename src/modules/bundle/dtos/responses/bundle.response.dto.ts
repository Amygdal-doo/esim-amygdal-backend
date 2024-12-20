import { ApiProperty } from '@nestjs/swagger';
import { CreditBundle, MonriCurrency } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { Expose, Type } from 'class-transformer';
import { PaginationResponseDto } from 'src/common/dtos/pagination.dto';

export class BundleResponseDto implements CreditBundle {
  @ApiProperty({
    description: 'Credit bundle ID',
    example: 'credit-bundle-123',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Credit bundle price',
    example: '100.00',
  })
  @Expose()
  @Type(() => String)
  price: Decimal;

  @ApiProperty({
    description: 'Credit bundle currency',
    example: MonriCurrency.USD,
    enum: MonriCurrency,
  })
  @Expose()
  currency: MonriCurrency;

  @ApiProperty({
    description: 'Number of credits in the credit bundle',
    example: 100,
  })
  @Expose()
  credits: number;

  @ApiProperty({
    description: 'Is the credit bundle active',
    example: true,
  })
  @Expose()
  isActive: boolean;

  @ApiProperty({
    description: 'Credit bundle title',
    example: '100 credits',
  })
  @Expose()
  title: string;

  @ApiProperty({
    description: 'Credit bundle created at',
    example: new Date(),
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Credit bundle updated at',
    example: new Date(),
  })
  @Expose()
  updatedAt: Date;
}

export class BundlePaginationResponseDto extends PaginationResponseDto {
  @Expose()
  @Type(() => BundleResponseDto)
  results: BundleResponseDto[];
}
