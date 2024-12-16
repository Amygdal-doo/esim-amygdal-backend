import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class PackageRequestDto {
  @ApiProperty({ description: 'Package ID', example: 'change-7days-1gb' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Package type', example: 'sim' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ description: 'Price of the package', example: 4.5 })
  @IsNumber()
  @IsNotEmpty()
  @Expose()
  price: number;

  @ApiProperty({ description: 'Data amount in MB', example: 1024 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ description: 'Validity in days', example: 7 })
  @IsNumber()
  @IsNotEmpty()
  day: number;

  @ApiProperty({
    description: 'Indicates if the package has unlimited data',
    example: false,
  })
  @IsBoolean()
  is_unlimited: boolean;

  @ApiProperty({
    description: 'Title of the package',
    example: '1 GB - 7 Days',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Data description', example: '1 GB' })
  @IsString()
  @IsNotEmpty()
  data: string;

  @ApiProperty({
    description: 'Short information about the package',
    example: "This eSIM doesn't come with a phone number.",
  })
  @IsString()
  @IsNotEmpty()
  short_info: string;

  @ApiPropertyOptional({ description: 'Included voice minutes', example: 100 })
  @IsNumber()
  @IsOptional()
  voice: number | null;

  @ApiProperty({ description: 'Included text messages', example: 100 })
  @IsNumber()
  @IsOptional()
  text: number | null;
}
