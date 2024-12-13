import { LoginType, Role } from '@prisma/client';

export class LoggedUserInfoDto {
  id: string;
  email: string;
  role: Role;
  username: string;
  isEmailConfirmed: boolean;
  // archived: boolean;
  loginType: LoginType;
}

export class LoggedUserInfoRefreshDto extends LoggedUserInfoDto {
  refreshToken: string;
}
