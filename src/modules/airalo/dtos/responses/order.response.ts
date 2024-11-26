import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  IsObject,
  IsArray,
  IsUrl,
  IsBoolean,
} from 'class-validator';
import { AiraloResponseDto } from './synchronize_plans.response.dto';
import { Type, Expose, Exclude } from 'class-transformer';

// UserDto
export class UserDto {
  @ApiProperty({ example: 120 })
  @IsNumber()
  @Exclude()
  id: number;

  @ApiProperty({ example: '2023-02-20 08:41:57' })
  @IsDateString()
  @Exclude()
  created_at: string;

  @ApiProperty({ example: 'User Name' })
  @IsString()
  @Exclude()
  name: string;

  @ApiProperty({ example: 'User.Name+sandbox2@airalo.com' })
  @IsString()
  @Exclude()
  email: string;

  @ApiProperty({ example: null })
  @IsOptional()
  @IsString()
  @Exclude()
  mobile?: string;

  @ApiProperty({ example: null })
  @IsOptional()
  @IsString()
  @Exclude()
  address?: string;

  @ApiProperty({ example: null })
  @IsOptional()
  @IsString()
  @Exclude()
  state?: string;

  @ApiProperty({ example: null })
  @IsOptional()
  @IsString()
  @Exclude()
  city?: string;

  @ApiProperty({ example: null })
  @IsOptional()
  @IsString()
  @Exclude()
  postal_code?: string;

  @ApiProperty({ example: null })
  @IsOptional()
  @IsNumber()
  @Exclude()
  country_id?: number;

  @ApiProperty({ example: 'User Name Airalo 2' })
  @IsString()
  @Exclude()
  company: string;
}

// SimDto
export class SimDto {
  @ApiProperty({ example: 11047 })
  @IsNumber()
  @Expose()
  id: number;

  @ApiProperty({ example: '2023-02-27 14:09:55' })
  @IsDateString()
  @Expose()
  created_at: string;

  @ApiProperty({ example: '891000000000009125' })
  @IsString()
  @Expose()
  iccid: string;

  @ApiProperty({ example: 'lpa.airalo.com' })
  @IsString()
  @Expose()
  lpa: string;

  @ApiProperty({ example: null })
  @IsOptional()
  @IsString()
  @Expose()
  imsis?: string;

  @ApiProperty({ example: 'TEST' })
  @IsString()
  @Expose()
  matching_id: string;

  @ApiProperty({ example: 'LPA:1$lpa.airalo.com$TEST' })
  @IsString()
  @Expose()
  qrcode: string;

  @ApiProperty({
    example:
      'https://sandbox.airalo.com/qr?expires=1763820595&id=13301&signature=1f0d45226a3857bd0645bf77225b7aee7e250f926763ee1d1a6e4be7fefde71e',
  })
  @IsUrl()
  @Expose()
  qrcode_url: string;

  @ApiProperty({ example: null })
  @IsOptional()
  @IsString()
  @Expose()
  airalo_code?: string;

  @ApiProperty({ example: 'automatic' })
  @IsString()
  @Expose()
  apn_type: string;

  @ApiProperty({ example: null })
  @IsOptional()
  @IsString()
  @Expose()
  apn_value?: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  @Expose()
  is_roaming: boolean;

  @ApiProperty({ example: null })
  @IsOptional()
  @IsString()
  @Expose()
  confirmation_code?: string;
}

// SimPackageDto
export class SimPackageDto {
  @ApiProperty({ example: 9666 })
  @IsNumber()
  @Expose()
  id: number;

  @ApiProperty({ example: '2023-02-27 14:09:55' })
  @IsDateString()
  @Expose()
  created_at: string;

  @ApiProperty({ example: '20230227-009666' })
  @IsString()
  @Expose()
  code: string;

  @ApiProperty({ example: 'Example description to identify the order' })
  @IsString()
  @Expose()
  description: string;

  @ApiProperty({ example: 'sim' })
  @IsString()
  @Expose()
  type: string;

  @ApiProperty({ example: 'kallur-digital-7days-1gb' })
  @IsString()
  @Expose()
  package_id: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Expose()
  quantity: number;

  @ApiProperty({ example: 'Kallur Digital-1 GB - 7 Days' })
  @IsString()
  @Expose()
  package: string;

  @ApiProperty({ example: 'Prepaid' })
  @IsString()
  @Expose()
  esim_type: string;

  @ApiProperty({ example: '7' })
  @IsString()
  @Expose()
  validity: string;

  @ApiProperty({ example: '9.50' })
  @IsString()
  @Expose()
  price: string;

  @ApiProperty({ example: '1 GB' })
  @IsString()
  @Expose()
  data: string;

  @ApiProperty({ example: 'USD' })
  @IsString()
  @Expose()
  currency: string;

  @ApiProperty({ example: '<p>...</p>' })
  @IsString()
  @Expose()
  manual_installation: string;

  @ApiProperty({ example: '<p>...</p>' })
  @IsString()
  @Expose()
  qrcode_installation: string;

  @ApiProperty({
    example: {
      en: 'https://sandbox.airalo.com/installation-guide',
    },
  })
  @IsObject()
  @Expose()
  installation_guides: Record<string, string>;

  @ApiProperty({ type: UserDto })
  @Type(() => UserDto)
  @IsObject()
  @Exclude()
  user: UserDto;

  @ApiProperty({ type: [SimDto] })
  @Type(() => SimDto)
  @IsArray()
  @Expose()
  sims: SimDto[];

  @ApiProperty({
    example: { name: 'Completed', slug: 'completed' },
  })
  @IsObject()
  @Expose()
  status: { name: string; slug: string };
}

// Main DTO for the array
export class OrderListResponseDto extends AiraloResponseDto {
  @ApiProperty({ type: [SimPackageDto] })
  @IsArray()
  @Type(() => SimPackageDto)
  @Expose()
  data: SimPackageDto[];
}
