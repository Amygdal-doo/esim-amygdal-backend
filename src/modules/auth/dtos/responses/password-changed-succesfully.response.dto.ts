import { ApiProperty } from '@nestjs/swagger';

export class PasswordChangedSuccesfullyResponseDto {
  @ApiProperty({
    type: String,
    required: true,
    description:
      'Password changed successfully. You can now login with your new password.',
    example: 'Password changed successfully.',
  })
  message: string;
}
