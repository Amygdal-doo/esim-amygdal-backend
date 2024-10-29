import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { IsEqualTo } from '../validation/password-match.decorator';

export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  @MinLength(8, { message: 'The min length of password is 8' })
  @MaxLength(32, {
    message: " The password can't accept more than 32 characters ",
  })
  newPassword: string;

  @ApiProperty()
  @IsString()
  @MinLength(8, { message: 'The min length of password is 8' })
  @MaxLength(32, {
    message: " The password can't accept more than 32 characters ",
  })
  @IsEqualTo<ChangePasswordDto>('newPassword')
  repeatPassword: string;
}
export class ChangePasswordDto extends ResetPasswordDto {
  @ApiProperty()
  @IsString()
  oldPassword: string;
}
