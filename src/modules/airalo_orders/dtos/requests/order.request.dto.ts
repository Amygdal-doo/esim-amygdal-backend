import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus, Prisma } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOrderRequestDto implements Prisma.AiraloOrderCreateInput {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  orderId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  orderCreatedAt: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  packageId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  esim?: Prisma.EsimCreateNestedManyWithoutOrderInput;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  user: Prisma.UserCreateNestedOneWithoutAiralOrdersInput;

  @ApiProperty()
  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status: OrderStatus;

  transaction: Prisma.TransactionCreateNestedOneWithoutAiraloOrderInput;
}
