import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class ChangeEmailDto {
  @ApiProperty({
    example: 'U7yXW@example.com',
    description: 'Current email address',
  })
  @IsString()
  @MinLength(8, { message: 'The min length of password is 8' })
  @MaxLength(64, {
    message: " The password can't accept more than 64 characters ",
  })
  currentPassword: string;

  @ApiProperty({
    example: 'U7yXW@example.com',
    description: 'Old email address',
  })
  @IsEmail()
  oldEmail: string;

  @ApiProperty({
    example: 'U7yXW@example.com',
    description: 'New email address',
  })
  @IsEmail()
  email: string;
}
