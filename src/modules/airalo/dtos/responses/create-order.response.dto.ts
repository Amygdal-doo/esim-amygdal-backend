import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Type, Expose } from 'class-transformer';
import { SimDto } from './order.response';

class InstallationGuidesDto {
  @ApiProperty({ example: 'https://sandbox.airalo.com/installation-guide' })
  @IsString()
  @Expose()
  en: string;
}

export class DataResponseDto {
  @ApiProperty({ example: 'kallur-digital-7days-1gb' })
  @IsString()
  @Expose()
  package_id: string;

  @ApiProperty({ example: '1' })
  @IsString()
  @Expose()
  quantity: string;

  @ApiProperty({ example: 'sim' })
  @IsString()
  @Expose()
  type: string;

  @ApiProperty({ example: 'Example description to identify the order' })
  @IsString()
  @Expose()
  description: string;

  @ApiProperty({ example: 'Prepaid' })
  @IsString()
  @Expose()
  esim_type: string;

  @ApiProperty({ example: 7 })
  @IsNumber()
  @Expose()
  validity: number;

  @ApiProperty({ example: 'Kallur Digital-1 GB - 7 Days' })
  @IsString()
  @Expose()
  package: string;

  @ApiProperty({ example: '1 GB' })
  @IsString()
  @Expose()
  data: string;

  @ApiProperty({ example: 9.5 })
  @IsNumber()
  @Expose()
  price: number;

  @ApiProperty({ example: '2023-02-27 14:09:55' })
  @IsString()
  @Expose()
  created_at: string;

  @ApiProperty({ example: 9666 })
  @IsNumber()
  @Expose()
  id: number;

  @ApiProperty({ example: '20230227-009666' })
  @IsString()
  @Expose()
  code: string;

  @ApiProperty({ example: 'USD' })
  @IsString()
  @Expose()
  currency: string;

  @ApiProperty({
    example:
      '<p><b>eSIM name: </b>Kallur Digital</p><p><b>Coverage:</b> Faroe Islands</p><p><b>To manually activate the eSIM on your eSIM capable device:</b></p>',
  })
  @IsString()
  @Expose()
  manual_installation: string;

  @ApiProperty({
    example:
      '<p><b>eSIM name:</b> Kallur Digital</p><p><b>Coverage: </b>Faroe Islands</p><p><b>To activate the eSIM by scanning the QR code...</b></p>',
  })
  @IsString()
  @Expose()
  qrcode_installation: string;

  @ApiProperty({ type: InstallationGuidesDto })
  // @ValidateNested()
  @Type(() => InstallationGuidesDto)
  @Expose()
  installation_guides: InstallationGuidesDto;

  @ApiProperty({ example: 'our perfect brand' })
  @IsString()
  @Expose()
  brand_settings_name: string;

  @ApiProperty({ type: [SimDto] })
  // @ValidateNested({ each: true })
  @Type(() => SimDto)
  @Expose()
  sims: SimDto[];
}
export class CreateOrderResponseDto {
  @ApiProperty({ type: DataResponseDto })
  // @ValidateNested()
  @Type(() => DataResponseDto)
  @Expose()
  data: DataResponseDto;

  @ApiProperty({ example: { message: 'success' } })
  // @ValidateNested()
  @Type(() => Object)
  @Expose()
  meta: { message: string };
}
