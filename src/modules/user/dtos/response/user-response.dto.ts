import { ApiProperty } from '@nestjs/swagger';
import { LoginType, Role } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export class UserResponseDto {
  @ApiProperty({
    type: String,
    description: 'User ID',
    example: 'ecc5f54d-9ca0-4c45-8ba5-ea58d8b1c440',
  })
  @Expose()
  id: string;

  @ApiProperty({
    type: String,
    description: 'User email address',
    example: 'example@domain.com',
  })
  @Expose()
  email: string;

  @ApiProperty({
    type: String,
    description: 'Username of the user',
    example: 'user123',
  })
  @Expose()
  username: string;

  @ApiProperty({
    type: String,
    description: 'First name of the user',
    example: 'John',
  })
  @Expose()
  firstName: string;

  @ApiProperty({
    type: String,
    description: 'Last name of the user',
    example: 'Doe',
  })
  @Expose()
  lastName: string;

  @ApiProperty({
    enum: Role,
    description: 'Role of the user',
    example: Role.USER,
  })
  @Expose()
  role: Role;

  @ApiProperty({
    enum: LoginType,
    description: 'Login type of the user',
    example: LoginType.CREDENTIALS,
  })
  @Expose()
  loginType: LoginType;
  @ApiProperty({
    type: Date,
    description: 'Creation date of the user record',
    example: '2023-01-01T00:00:00Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    type: Date,
    description: 'Last update date of the user record',
    example: '2023-01-02T00:00:00Z',
  })
  @Expose()
  updatedAt: Date;

  @Exclude()
  googleId: string;

  @Exclude()
  appleId: string;

  @Exclude()
  microsoftId: string;

  @Exclude()
  password: string;
}

// export class GetLoggedUserResponseDto extends UserResponseDto {
//   @Expose()
//   firstName: string;
//   @Expose()
//   lastName: string;
// }
