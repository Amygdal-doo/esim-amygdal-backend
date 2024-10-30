import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Access token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIiLCJpYXQiOjE2NjU0NjUzODAsImV4cCI6MTY2NTQ2OTc4MH0.3p9o7V4mLZbC4b5k5pXbqYI0XVlBwFf8n7I-9Q2jvI',
  })
  accessToken: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Refresh token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIiLCJpYXQiOjE2NjU0NjUzODAsImV4cCI6MTY2NTQ2OTc4MH0.3p9o7V4mLZbC4b5k5pXbqYI0XVlBwFf8n7I-9Q2jvI',
  })
  refreshToken: string;
}
