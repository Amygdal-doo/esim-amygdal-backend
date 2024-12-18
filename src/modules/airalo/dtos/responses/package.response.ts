import { ApiProperty } from '@nestjs/swagger';
import { OperatorDto, PackageDto } from './synchronize_plans.response.dto';
import { Expose } from 'class-transformer';

export class PackageResponseDto extends PackageDto {
  @ApiProperty({ description: 'Package operator', type: OperatorDto })
  @Expose()
  operator: Partial<OperatorDto>;
}
