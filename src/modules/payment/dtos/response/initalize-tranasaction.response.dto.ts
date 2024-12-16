import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class InitializeTransactionResponseDto {
  @ApiProperty({
    description: 'Digest',
    example:
      'd8d29b45750a4d6e7430f921a221e52b62c6056cc1730d523b7e4aa387861f349551feaf1ae4e3a84103c39cd0e7421dc7de2d1c82ccb2288e49859c8fb7a274',
  })
  @Expose()
  digest: string;

  @ApiProperty({
    description: 'Ammount in cents',
    example: '1000',
  })
  @Expose()
  amount: string;

  @ApiProperty({
    description: 'Currency',
    example: 'USD',
  })
  @Expose()
  currency: string;

  @ApiProperty({
    description: 'Order number',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  orderNumber: string;
}
