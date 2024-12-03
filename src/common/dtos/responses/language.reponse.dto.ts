import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Language } from '@prisma/client';

export class LanguageResponseDto implements Language {
  @ApiProperty({
    description: 'Unique identifier for the image',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Name of the language',
    example: 'English',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'Language code',
    example: 'en',
    nullable: true,
  })
  @Expose()
  code: string | null;
}
