import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsBoolean,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Expose } from 'class-transformer';

// class StepsDto {
//   @ApiProperty({
//     description: 'Step 1 description',
//     example: 'Go to Settings > Cellular/Mobile > Add Cellular/Mobile Plan.',
//   })
//   @IsString()
//   @Expose()
//   '1': string;

//   @ApiProperty({
//     description: 'Step 2 description',
//     example: 'Scan the QR Code.',
//   })
//   @IsString()
//   @Expose()
//   '2': string;

//   @ApiProperty({
//     description: 'Step 3 description',
//     example: 'Tap on "Add Cellular Plan".',
//   })
//   @IsString()
//   @IsOptional()
//   @Expose()
//   '3': string;

//   // Add other steps as required
// }

class InstallationViaQRCodeDto {
  @ApiProperty({ type: Object })
  @Type(() => Object)
  @Expose()
  steps: {
    [key: string]: string;
  };

  @ApiProperty({
    description: 'QR code data',
    example: 'LPA:1$lpa.airalo.com$TEST',
  })
  @IsString()
  @Expose()
  qr_code_data: string;

  @ApiProperty({
    description: 'QR code URL',
    example:
      'https://sandbox.airalo.com/qr?expires=1797582688&id=115516&signature=3ee...',
  })
  @IsString()
  @Expose()
  qr_code_url: string;

  @ApiProperty({
    description: 'Direct Apple installation URL',
    example: 'https://esimsetup.apple.com/esim_qrcode_provisioning?...',
  })
  @IsString()
  @IsOptional()
  @Expose()
  direct_apple_installation_url?: string;
}

class InstallationManualDto {
  @ApiProperty({ type: Object })
  @Type(() => Object)
  @Expose()
  steps: {
    [key: string]: string;
  };

  @ApiProperty({
    description: 'SM-DP+ Address and Activation Code',
    example: 'lpa.airalo.com',
  })
  @IsString()
  @Expose()
  smdp_address_and_activation_code: string;
}

class NetworkSetupDto {
  @ApiProperty({ type: Object })
  @Type(() => Object)
  @Expose()
  steps: {
    [key: string]: string;
  };

  @ApiProperty({ description: 'APN type', example: 'manual' })
  @IsString()
  @Expose()
  apn_type: string;

  @ApiProperty({ description: 'APN value', example: 'singleall' })
  @IsString()
  @Expose()
  apn_value: string;

  @ApiProperty({ description: 'Is roaming enabled', example: true })
  @IsBoolean()
  @Expose()
  is_roaming: boolean;
}

class OSInstructionsDto {
  @ApiProperty({ type: InstallationViaQRCodeDto })
  @ValidateNested()
  @Type(() => InstallationViaQRCodeDto)
  @Expose()
  installation_via_qr_code: InstallationViaQRCodeDto;

  @ApiProperty({ type: InstallationManualDto })
  @ValidateNested()
  @Type(() => InstallationManualDto)
  @Expose()
  installation_manual: InstallationManualDto;

  @ApiProperty({ type: NetworkSetupDto })
  @ValidateNested()
  @Type(() => NetworkSetupDto)
  @Expose()
  network_setup: NetworkSetupDto;
}

class InstructionsDto {
  @ApiProperty({ description: 'Language of the instructions', example: 'EN' })
  @IsString()
  @Expose()
  language: string;

  @ApiProperty({
    type: [OSInstructionsDto],
    description: 'Instructions for iOS',
  })
  @ValidateNested({ each: true })
  @Type(() => OSInstructionsDto)
  @Expose()
  ios: OSInstructionsDto[];

  @ApiProperty({
    type: [OSInstructionsDto],
    description: 'Instructions for Android',
  })
  @ValidateNested({ each: true })
  @Type(() => OSInstructionsDto)
  @Expose()
  android: OSInstructionsDto[];
}

export class InstallationInstructionsResponseDto {
  @ApiProperty({ type: InstructionsDto })
  @ValidateNested()
  @Type(() => InstructionsDto)
  @Expose()
  instructions: InstructionsDto;

  @ApiProperty({
    description: 'Meta information about the response',
    example: { message: 'success' },
  })
  @IsObject()
  @IsOptional()
  @Expose()
  meta?: { message: string };
}
