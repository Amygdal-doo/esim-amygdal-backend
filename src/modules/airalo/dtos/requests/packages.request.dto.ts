import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsIn, IsNumber, Min } from 'class-validator';

export class GetPackagesDto {
  @ApiPropertyOptional({
    description: 'Filter packages by operator type.',
    enum: ['global', 'local'],
    example: 'global',
  })
  @IsOptional()
  @IsString()
  @IsIn(['global', 'local'])
  filterType?: 'global' | 'local';

  @ApiPropertyOptional({
    description: 'Filter packages by country code. Examples: US, DE, GB, etc.',
    example: 'TR',
  })
  @IsOptional()
  @IsString()
  filterCountry?: string;

  @ApiPropertyOptional({
    description: 'Number of items returned per page.',
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Current page for pagination.',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Include topup packages in the response.',
    enum: ['topup'],
    example: 'topup',
  })
  @IsOptional()
  @IsString()
  @IsIn(['topup'])
  include?: 'topup';
}
