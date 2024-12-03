import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Currency } from '@prisma/client';

export class CurrencyResponseDto implements Currency {
  @ApiProperty({
    description: 'Unique identifier for the image',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Currency symbol',
    example: '$',
    nullable: true,
  })
  @Expose()
  symbol: string | null;

  @ApiProperty({
    description: 'Currency name',
    example: 'United States Dollar',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'Currency code',
    example: 'USD',
  })
  @Expose()
  code: string;
}
