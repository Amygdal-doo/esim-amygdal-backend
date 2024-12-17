import { ApiProperty } from '@nestjs/swagger';
import { Esim } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsOptional, IsUrl } from 'class-validator';

export class EsimResponseDto implements Esim {
  @ApiProperty({ description: 'eSIM ID', example: '11028' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'User ID', example: 'user-123' })
  @Expose()
  userId: string;

  @ApiProperty({ description: 'Order ID', example: 'order-123' })
  @IsOptional()
  @Expose()
  orderId: string;

  @ApiProperty({ description: 'QR Code', example: 'LPA:1$lpa.airalo.com$TEST' })
  @Expose()
  qrcode: string;

  @ApiProperty({
    description: 'QR Code URL',
    example: 'https://sandbox.airalo.com/qr?expires=...',
  })
  @IsUrl()
  @Expose()
  qrcodeUrl: string;

  @ApiProperty({ description: 'eSIM ID', example: 11028 })
  @Expose()
  esimId: number;

  @ApiProperty({ description: 'ICCID', example: '8944465400000267221' })
  @Expose()
  iccid: string;

  @ApiProperty({ description: 'Creation date', example: '2023-02-27 08:30:14' })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2023-02-27 08:30:14',
  })
  @Expose()
  updatedAt: Date;
}
