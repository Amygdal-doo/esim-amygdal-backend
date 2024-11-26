import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOrderRequestDto implements Prisma.OrderCreateInput {
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
  @IsString()
  @IsNotEmpty()
  quantity: string;

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
  user: Prisma.UserCreateNestedOneWithoutOrderInput;
}
