import { ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateUserProfileDto implements Prisma.ProfileUpdateInput {
  @ApiPropertyOptional({
    type: Boolean,
    description: 'Newsletter',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  newsletter?: boolean;

  @ApiPropertyOptional({
    type: String,
    description: 'Location',
    example: 'New York',
  })
  @IsString()
  @IsOptional()
  location?: string | null;

  @ApiPropertyOptional({
    type: String,
    description: 'Phone number',
    example: '1234567890',
  })
  @IsString()
  @IsOptional()
  phoneNumber?: string | null;
}
