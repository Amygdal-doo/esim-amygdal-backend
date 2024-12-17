import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { AiraloResponseDto } from './synchronize_plans.response.dto';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  IsUrl,
  IsObject,
} from 'class-validator';

export class StatusDto {
  @ApiProperty({ description: 'Status name', example: 'Completed' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Status slug', example: 'completed' })
  @IsString()
  @IsNotEmpty()
  slug: string;
}

export class InstallationGuidesDto {
  @ApiProperty({
    description: 'Installation guide URL for English',
    example: 'https://sandbox.airalo.com/installation-guide',
  })
  @IsUrl()
  @IsNotEmpty()
  en: string;
}

export class SharingDto {
  @ApiProperty({
    description: 'Sharing link',
    example: 'https://esims.cloud/our-perfect-brand/a4g5ht-58sdf1a',
  })
  @IsUrl()
  @IsNotEmpty()
  link: string;

  @ApiProperty({ description: 'Access code', example: '4812' })
  @IsString()
  @IsNotEmpty()
  access_code: string;
}

export class UserDto {
  @ApiProperty({ description: 'User ID', example: 120 })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'User creation date',
    example: '2023-02-20 08:41:57',
  })
  @IsString()
  @IsNotEmpty()
  created_at: string;

  @ApiProperty({ description: 'User name', example: 'User Name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'User email', example: 'email@domain.com' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({ description: 'User company', example: 'Company Name' })
  @IsOptional()
  @IsString()
  company?: string;

  // Add other optional fields like address, state, etc., as needed
}

export class SimableDto {
  @ApiProperty({ description: 'Simable ID', example: 9647 })
  @IsNumber()
  id: number;

  @ApiProperty({ description: 'Creation date', example: '2023-02-27 08:30:14' })
  @IsString()
  @IsNotEmpty()
  created_at: string;

  @ApiProperty({ description: 'Simable code', example: '20230227-009647' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'Simable type', example: 'sim' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description: 'Package ID',
    example: 'kallur-digital-7days-1gb',
  })
  @IsString()
  @IsNotEmpty()
  package_id: string;

  @ApiProperty({
    description: 'Package name',
    example: 'Kallur Digital-1 GB - 7 Days',
  })
  @IsString()
  @IsNotEmpty()
  package: string;

  @ApiProperty({ description: 'Price', example: '9.50' })
  @IsString()
  @IsNotEmpty()
  price: string;

  @ApiPropertyOptional({ description: 'Installation guides' })
  @IsOptional()
  @IsObject()
  installation_guides?: InstallationGuidesDto;

  @ApiPropertyOptional({ description: 'Simable status' })
  @IsOptional()
  @IsObject()
  status?: StatusDto;

  @ApiPropertyOptional({ description: 'User details' })
  @IsOptional()
  @IsObject()
  user?: UserDto;

  @ApiPropertyOptional({ description: 'Sharing details' })
  @IsOptional()
  @IsObject()
  sharing?: SharingDto;
}

export class EsimDto {
  @ApiProperty({ description: 'eSIM ID', example: 11028 })
  @IsNumber()
  id: number;

  @ApiProperty({ description: 'Creation date', example: '2023-02-27 08:30:14' })
  @IsString()
  @IsNotEmpty()
  created_at: string;

  @ApiProperty({ description: 'ICCID', example: '8944465400000267221' })
  @IsString()
  @IsNotEmpty()
  iccid: string;

  @ApiProperty({ description: 'LPA URL', example: 'lpa.airalo.com' })
  @IsString()
  @IsNotEmpty()
  lpa: string;

  @ApiProperty({ description: 'Matching ID', example: 'TEST' })
  @IsString()
  @IsNotEmpty()
  matching_id: string;

  @ApiProperty({ description: 'QR Code', example: 'LPA:1$lpa.airalo.com$TEST' })
  @IsString()
  @IsNotEmpty()
  qrcode: string;

  @ApiProperty({
    description: 'QR Code URL',
    example: 'https://sandbox.airalo.com/qr?expires=...',
  })
  @IsUrl()
  @IsNotEmpty()
  qrcode_url: string;

  @ApiPropertyOptional({
    description: 'Direct Apple Installation URL',
    example: 'https://esimsetup.apple.com/esim_qrcode_provisioning?...',
  })
  @IsOptional()
  @IsUrl()
  direct_apple_installation_url?: string;

  @ApiProperty({ description: 'Is roaming active', example: true })
  @IsBoolean()
  is_roaming: boolean;

  @ApiPropertyOptional({ description: 'Simable details' })
  @IsOptional()
  @IsObject()
  simable?: SimableDto;
}
export class MetaDto {
  @ApiProperty({
    description: 'Message indicating the result of the API call.',
    type: String,
    example: 'api.success',
  })
  @Expose()
  message: string;
}

export class SimsListResponseDto extends AiraloResponseDto {
  @ApiProperty({ description: 'List of sims', type: [EsimDto] })
  @Expose()
  data: EsimDto[];
}

export class SimsResponseDto {
  @ApiProperty({ description: 'sims', type: EsimDto })
  @Expose()
  data: EsimDto;

  @ApiProperty({ description: 'message', type: MetaDto })
  @Expose()
  meta: MetaDto;
}
