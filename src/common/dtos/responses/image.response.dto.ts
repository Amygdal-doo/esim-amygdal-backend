import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Image } from '@prisma/client';

export class ImageResponseDto implements Image {
  @ApiProperty({
    description: 'Unique identifier for the image',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Source URL of the image',
    example: 'https://example.com/image.png',
  })
  @Expose()
  src: string;

  @ApiProperty({
    description: 'Alternative text for the image',
    example: 'An example image description',
    nullable: true,
  })
  @Expose()
  altText: string | null;

  @ApiProperty({
    description: 'Width of the image in pixels',
    example: 800,
  })
  @Expose()
  width: number;

  @ApiProperty({
    description: 'Height of the image in pixels',
    example: 600,
  })
  @Expose()
  height: number;

  @ApiProperty({
    description: 'Timestamp of when the image was created',
    example: '2023-01-01T00:00:00.000Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp of when the image was last updated',
    example: '2023-01-02T00:00:00.000Z',
  })
  @Expose()
  updatedAt: Date;
}
