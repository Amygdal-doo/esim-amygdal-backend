import { ApiProperty } from '@nestjs/swagger';
import { Country } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { CurrencyResponseDto } from 'src/common/dtos/responses/currency.response.dto';
import { ImageResponseDto } from 'src/common/dtos/responses/image.response.dto';
import { LanguageResponseDto } from 'src/common/dtos/responses/language.reponse.dto';

export class CountryResponseDto implements Country {
  @ApiProperty({
    description: 'Country title',
    example: 'United States',
  })
  @Expose()
  title: string;

  @ApiProperty({
    description: 'Country id',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Country slug',
    example: 'united-states',
  })
  @Expose()
  slug: string;

  @ApiProperty({
    description: 'Country code',
    example: 'US',
    nullable: true,
  })
  @Expose()
  code: string | null;

  @ApiProperty({
    description: 'Country region',
    example: 'North America',
    nullable: true,
  })
  @Expose()
  region: string | null;

  @ApiProperty({
    description: 'Country currency id',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    nullable: true,
  })
  @Expose()
  currencyId: string | null;

  @ApiProperty({
    description: 'Country language id',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    nullable: true,
  })
  @Expose()
  languageId: string | null;

  @ApiProperty({
    description: 'Country image id',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    nullable: true,
  })
  @Expose()
  imageId: string | null;

  @ApiProperty({
    description: 'Country dialling code',
    example: '+1',
    nullable: true,
  })
  @Expose()
  diallingCode: string | null;

  @ApiProperty({
    description: 'Country Flag image',
    example: ImageResponseDto,
    nullable: true,
  })
  @Expose()
  @Type(() => ImageResponseDto)
  image: ImageResponseDto;

  @ApiProperty({
    description: 'Country currency',
    example: CurrencyResponseDto,
    nullable: true,
  })
  @Expose()
  @Type(() => CurrencyResponseDto)
  currency: CurrencyResponseDto;

  @ApiProperty({
    description: 'Country language',
    example: LanguageResponseDto,
    nullable: true,
  })
  @Expose()
  @Type(() => LanguageResponseDto)
  language: LanguageResponseDto;
}
