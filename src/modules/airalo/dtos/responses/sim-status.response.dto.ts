import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { DataStatus } from '../../enums/data.status.enum';
import { MetaDto } from './sims.response.dto';

export class DataDto {
  @ApiProperty({
    description: 'Remaining data in MB.',
    example: 767,
  })
  @Expose()
  remaining: number;

  @ApiProperty({
    description: 'Total data in MB.',
    example: 2048,
  })
  @Expose()
  total: number;

  @ApiProperty({
    description:
      'Expiration date and time of the data plan in ISO-8601 format.',
    example: '2022-01-01T00:00:00.000Z',
  })
  @Expose()
  expired_at: string;

  @ApiProperty({
    description: 'Indicates whether the data is unlimited.',
    example: true,
  })
  @Expose()
  is_unlimited: boolean;

  @ApiProperty({
    description: 'Current status of the data plan.',
    example: 'ACTIVE',
    enum: DataStatus,
  })
  @Expose()
  status: DataStatus;

  @ApiProperty({
    description: 'Remaining voice minutes.',
    example: 0,
  })
  @Expose()
  remaining_voice: number;

  @ApiProperty({
    description: 'Remaining text messages.',
    example: 0,
  })
  @Expose()
  remaining_text: number;

  @ApiProperty({
    description: 'Total voice minutes available.',
    example: 0,
  })
  @Expose()
  total_voice: number;

  @ApiProperty({
    description: 'Total text messages available.',
    example: 0,
  })
  @Expose()
  total_text: number;
}

export class SimStatusResponseDto {
  @ApiProperty({
    description: 'Data details of the response.',
    type: DataDto,
  })
  @Expose()
  data: DataDto;

  @ApiProperty({
    description: 'Metadata of the API response.',
    type: MetaDto,
  })
  @Expose()
  meta: MetaDto;
}
