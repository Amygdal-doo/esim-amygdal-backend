import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { IsEqualTo } from '../validation/password-match.decorator';

export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  @MinLength(8, { message: 'The min length of password is 8' })
  @MaxLength(64, {
    message: " The password can't accept more than 64 characters ",
  })
  newPassword: string;

  @ApiProperty()
  @IsString()
  @MinLength(8, { message: 'The min length of password is 8' })
  @MaxLength(64, {
    message: " The password can't accept more than 64 characters ",
  })
  @IsEqualTo<ChangePasswordDto>('newPassword')
  repeatPassword: string;
}
export class ChangePasswordDto extends ResetPasswordDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  oldPassword: string;
}
