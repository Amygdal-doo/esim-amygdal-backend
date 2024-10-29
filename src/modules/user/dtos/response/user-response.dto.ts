import { LoginType, Role } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  username: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  role: Role;

  // @Expose()
  // profilePicture: Prisma.JsonValue;

  // @Expose()
  // phoneNumber: string | null;

  @Expose()
  loginType: LoginType;

  @Exclude()
  googleId: string;

  @Exclude()
  appleId: string;

  @Exclude()
  password: string;
  // @Exclude()
  // isEmailConfirmed: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

// export class GetLoggedUserResponseDto extends UserResponseDto {
//   @Expose()
//   firstName: string;
//   @Expose()
//   lastName: string;
// }
