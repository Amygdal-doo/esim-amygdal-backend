import { ApiProperty } from '@nestjs/swagger';
import { Profile } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from './user-response.dto';

export class UserProfileResponseDto implements Profile {
  @ApiProperty({
    type: String,
    description: 'User ID',
    example: 'ecc5f54d-9ca0-4c45-8ba5-ea58d8b1c440',
  })
  @Expose()
  id: string;

  //   @ApiProperty({
  //     type: String,
  //     description: 'User email address',
  //     example: 'example@domain.com',
  //   })
  //   @Expose()
  //   email: string;

  @ApiProperty({
    type: Boolean,
    description: 'sUBSCRIBED TO NEWSLETTER',
    example: false,
  })
  @Expose()
  newsletter: boolean;

  @ApiProperty({
    type: String,
    description: 'Location',
    example: 'New York',
  })
  @Expose()
  location: string | null;

  @ApiProperty({
    type: String,
    description: 'Phone number',
    example: '1234567890',
  })
  @Expose()
  phoneNumber: string | null;

  @ApiProperty({
    type: String,
    description: 'User ID',
    example: 'ecc5f54d-9ca0-4c45-8ba5-ea58d8b1c440',
  })
  userId: string;

  @ApiProperty({
    type: UserResponseDto,
    example: UserResponseDto,
    description: 'User',
  })
  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;
}
