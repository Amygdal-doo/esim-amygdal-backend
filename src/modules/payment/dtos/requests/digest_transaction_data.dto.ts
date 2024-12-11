import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IDigest } from 'src/common/interfaces/digest.interface';

export class DigestTransactionDataDto implements IDigest {
  @ApiProperty({
    description: 'Order number',
    example: '123456789',
  })
  @IsString()
  @IsNotEmpty()
  order_number: string;

  @ApiProperty({
    description: 'Amount',
    example: '1000',
  })
  @IsString()
  @IsNotEmpty()
  amount: string;

  @ApiProperty({
    description: 'Currency',
    example: 'USD',
  })
  @IsString()
  @IsNotEmpty()
  currency: string;
}
