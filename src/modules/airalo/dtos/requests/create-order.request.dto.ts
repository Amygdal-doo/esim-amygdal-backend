import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  IsArray,
  Min,
  Max,
  ValidateIf,
  IsNumber,
} from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    description: 'The quantity of items in the order. Maximum of 50.',
    example: 1,
    required: true,
  })
  @IsNumber()
  @Min(1)
  @Max(50)
  quantity: number;

  @ApiProperty({
    description:
      'The package ID associated with the order. Obtainable from the "Packages / Get Packages" endpoint.',
    example: 'kallur-digital-7days-1gb',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  package_id: string;

  @ApiPropertyOptional({
    description:
      'The type of order. The only possible value is "sim". Default is "sim" if left empty.',
    example: 'sim',
    default: 'sim',
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({
    description:
      'A custom description for the order to help identify it later.',
    example: '1 sim kallur-digital-7days-1gb',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description:
      'The brand under which the eSIM should be shared. Null for unbranded.',
    example: 'our perfect brand',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  brand_settings_name?: string | null;

  @ApiPropertyOptional({
    description:
      'Email address to send the eSIM sharing information. If specified, sharing_option should also be set.',
    example: 'valid_email@address.com',
  })
  @IsOptional()
  @IsEmail()
  to_email?: string;

  @ApiPropertyOptional({
    description:
      'Array of sharing options required when to_email is set. Available options: link, pdf.',
    example: ['link'],
    type: [String],
  })
  @ValidateIf((dto) => dto.to_email)
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  sharing_option?: string[];

  @ApiPropertyOptional({
    description: 'Array of email addresses to copy when to_email is set.',
    example: ['valid_email@address.com'],
    type: [String],
  })
  @ValidateIf((dto) => dto.to_email)
  @IsArray()
  @IsEmail({}, { each: true })
  copy_address?: string[];
}
