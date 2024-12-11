import { ApiProperty } from '@nestjs/swagger';

export class EmailChangedSuccesfullyResponseDto {
  @ApiProperty({
    type: String,
    required: true,
    description:
      'Email changed successfully. You can now login with your new email.',
    example: 'Email changed successfully.',
  })
  message: string;
}
