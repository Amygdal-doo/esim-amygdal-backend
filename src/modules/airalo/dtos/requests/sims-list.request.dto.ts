import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class GetSimsDto {
  @ApiPropertyOptional({
    description:
      'Optional. A comma-separated string to include related data in the response. Possible values are "order", "order.status", "order.user" and "share".',
    example: 'order,order.status,order.user,share',
  })
  @IsOptional()
  @IsString()
  include?: string;
}

export class GetSimsListDto {
  @ApiPropertyOptional({
    description:
      'Optional. A string to filter eSIMs by their creation date. Specify the date range using a dash (-) as a delimiter for correct parsing.',
    example: '2023-02-22-2024-02-22',
  })
  @IsOptional()
  @IsString()
  filterCreatedAt?: string;

  @ApiPropertyOptional({
    description:
      "Optional. A string to filter eSIMs by their ICCID. This performs a like search using the format '%SIM_ICCID%'.",
    example: '8944465400000217735',
  })
  @IsOptional()
  @IsString()
  filterIccid?: string;

  @ApiPropertyOptional({
    description:
      'Number of items returned per page. Optional. An integer specifying how many sims will be returned on each page.',
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({
    description:
      'Current page for pagination. Optional. An integer specifying the paginations current page.',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description:
      'Optional. A comma-separated string to include related data in the response. Possible values are "order", "order.status", "order.user" and "share".',
    example: 'order,order.status,order.user,share',
  })
  @IsOptional()
  @IsString()
  include?: string;
}
