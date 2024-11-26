import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, IsIn, Matches } from 'class-validator';

export class OrderListQueryDto {
  @ApiPropertyOptional({
    description: `A comma-separated string to include related data in the response. Possible values are "sims", "user", and "status".`,
    example: 'sims,user,status',
  })
  @IsOptional()
  @Matches(/^(sims|user|status)(,(sims|user|status))*$/, {
    message:
      'Include must be a comma-separated string containing "sims", "user", or "status".',
  })
  @IsString()
  include?: string;

  @ApiPropertyOptional({
    description: `A string to filter orders by their creation date. Use the format Y-m-d - Y-m-d.`,
    example: '2023-01-01 - 2023-01-31',
  })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2} - \d{4}-\d{2}-\d{2}$/, {
    message: 'Filter[created_at] must be in the format "Y-m-d - Y-m-d".',
  })
  @IsString()
  filterCreatedAt?: string;

  @ApiPropertyOptional({
    description: `Filter orders by their order code. Performs a like search using the format '%ORDER_CODE%'.`,
    example: '20221021-003188',
  })
  @IsOptional()
  @IsString()
  filterCode?: string;

  @ApiPropertyOptional({
    description: `Filter orders by their status. Possible values: "completed", "failed", "refunded".`,
    example: 'completed',
  })
  @IsOptional()
  @IsIn(['completed', 'failed', 'refunded'], {
    message:
      'Filter[order_status] must be one of "completed", "failed", "refunded".',
  })
  @IsString()
  filterOrderStatus?: string;

  @ApiPropertyOptional({
    description: `Filter orders by the sim's ICCID. Performs a like search using the format '%SIM_ICCID%'.`,
    example: '891000000000001868',
  })
  @IsOptional()
  @IsString()
  filterIccid?: string;

  @ApiPropertyOptional({
    description: `Filter orders by their description. Performs a like search using the format '%DESCRIPTION%'.`,
    example: 'Your order description',
  })
  @IsOptional()
  @IsString()
  filterDescription?: string;

  @ApiPropertyOptional({
    description: `Specify how many orders will be returned on each page.`,
    example: 50,
    default: 50,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional({
    description: `Specify the pagination's current page.`,
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;
}

export class OrderQueryDto {
  @ApiPropertyOptional({
    description: `A comma-separated string to include related data in the response. Possible values are "sims", "user", and "status".`,
    example: 'sims,user,status',
  })
  @IsOptional()
  @Matches(/^(sims|user|status)(,(sims|user|status))*$/, {
    message:
      'Include must be a comma-separated string containing "sims", "user", or "status".',
  })
  @IsString()
  include?: string;
}
