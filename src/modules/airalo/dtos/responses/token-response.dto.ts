import { ApiProperty } from '@nestjs/swagger';

export class AiraloTokenDataDto {
  @ApiProperty({
    type: String,
    example: 'Bearer',
    description: 'Type of token',
  })
  token_type: string;

  @ApiProperty({
    type: Number,
    example: 31622400,
    description: 'Time in seconds until the token expires',
  })
  expires_in: number;

  @ApiProperty({
    type: String,
    example: '<access token>',
    description: 'Access token',
  })
  access_token: string;
}

export class AiraloTokenResponseDto {
  data: AiraloTokenDataDto;

  meta: {
    message: string;
  };
}
