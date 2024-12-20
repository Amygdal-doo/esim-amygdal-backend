import { ApiProperty } from '@nestjs/swagger';
import {
  OrderStatus,
  WalletTransaction,
  WalletTransactionType,
} from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { Expose, Type } from 'class-transformer';
import { PaginationResponseDto } from 'src/common/dtos/pagination.dto';

export class WalletTransactionResponseDto implements WalletTransaction {
  @ApiProperty({
    description: 'Wallet transaction ID',
    example: 'wallet-transaction-123',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Wallet transaction amount',
    example: '100.00',
  })
  @Expose()
  amount: Decimal;

  @ApiProperty({
    description: 'Wallet transaction description',
    example: 'Transaction description',
  })
  @Expose()
  description: string | null;

  @ApiProperty({
    description: 'Wallet transaction type',
    example: WalletTransactionType.CREDIT_PURCHASE,
    enum: WalletTransactionType,
  })
  @Expose()
  type: WalletTransactionType;

  @ApiProperty({
    description: 'User ID',
    example: 'user-123',
  })
  @Expose()
  userId: string;

  @ApiProperty({
    description: 'Wallet transaction status',
    example: OrderStatus.COMPLETED,
    enum: OrderStatus,
  })
  @Expose()
  status: OrderStatus;

  @ApiProperty({
    description: 'Wallet transaction created at',
    example: new Date(),
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Wallet transaction updated at',
    example: new Date(),
  })
  @Expose()
  updatedAt: Date;
}

export class WalletTransactionPaginationResponseDto extends PaginationResponseDto {
  @Expose()
  @Type(() => WalletTransactionResponseDto)
  results: WalletTransactionResponseDto[];
}
