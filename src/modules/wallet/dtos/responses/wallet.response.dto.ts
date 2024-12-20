import { ApiProperty } from '@nestjs/swagger';
import { Wallet } from '@prisma/client';
import { Expose } from 'class-transformer';

export class WalletResponseDto implements Wallet {
  @ApiProperty({
    description: 'Wallet ID',
    example: 'wallet-123',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Wallet balance',
    example: 500,
  })
  @Expose()
  balance: number;

  @ApiProperty({
    description: 'User ID',
    example: 'user-123',
  })
  @Expose()
  userId: string;

  @ApiProperty({
    description: 'Wallet created at',
    example: new Date(),
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Wallet updated at',
    example: new Date(),
  })
  @Expose()
  updatedAt: Date;
}
