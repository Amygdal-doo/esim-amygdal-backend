import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class IntentResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @Expose()
  clientSecret: string;
}
