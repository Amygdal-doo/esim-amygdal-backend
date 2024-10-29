import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LocalRegisterBodyDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(2, 50)
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(2, 50)
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(4, 32)
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'The min length of password is 8' })
  @MaxLength(32, {
    message: " The password can't accept more than 32 characters ",
  })
  password: string;
}
