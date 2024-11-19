import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class AiraloTokenDataDto {
  @ApiProperty({
    type: String,
    example: 'Bearer',
    description: 'Type of token',
  })
  @IsString()
  @Expose()
  token_type: string;

  @ApiProperty({
    type: Number,
    example: 31622400,
    description: 'Time in seconds until the token expires',
  })
  @IsNumber()
  @Expose()
  expires_in: number;

  @ApiProperty({
    type: String,
    example: '<access token>',
    description: 'Access token',
  })
  @IsString()
  @Expose()
  access_token: string;
}

export class AiraloTokenResponseDto {
  @ApiProperty({
    type: AiraloTokenDataDto,
    description: 'Access token data',
  })
  @Type(() => AiraloTokenDataDto)
  @Expose()
  data: AiraloTokenDataDto;

  @ApiProperty({
    description: 'Response metadata',
  })
  @Type(() => Object)
  @Expose()
  meta: {
    message: string;
  };
}
