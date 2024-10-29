import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LocalLoginDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(8, { message: 'The min length of password is 8' })
  @MaxLength(32, {
    message: " The password can't accept more than 32 characters ",
  })
  password: string;
}
