import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserBodyDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ type: String, example: '123456Aa!!' })
  @IsNotEmpty()
  @IsString()
  @Length(6, 32)
  password: string;

  @ApiProperty({ enum: Role, default: Role.USER })
  @IsNotEmpty()
  @IsEnum(Role)
  role?: Role;
}
