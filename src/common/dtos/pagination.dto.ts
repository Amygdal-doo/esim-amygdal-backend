import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { SortOrder } from '../enums/order.enum';

export class PaginationQueryDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Page number. Starts from 1.',
  })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  page?: number;

  @ApiPropertyOptional({
    example: 10,
    description: 'Number of items returned per page.',
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  limit?: number;
}

export class PaginationResponseDto {
  @ApiProperty({ example: 25, description: 'Items per page' })
  @Expose()
  limit: number;

  @ApiProperty({ example: 1, description: 'Current page' })
  @Expose()
  page: number;

  @ApiProperty({ example: 1, description: 'Total pages' })
  @Expose()
  pages: number;

  @ApiProperty({ example: 1, description: 'Total items' })
  @Expose()
  total: number;

  @ApiProperty({ example: [], description: 'Results' })
  @Expose()
  results: Array<any>;
}

export class OrderType {
  @ApiPropertyOptional({ enum: SortOrder, example: 'asc' })
  @IsEnum(SortOrder)
  @IsOptional()
  type?: SortOrder;
}
