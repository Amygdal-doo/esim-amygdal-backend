import { LoginType } from 'src/common/enums/loginType.enum';
import { Role } from 'src/common/enums/role.enum';

export class LoggedUserInfoDto {
  id: string;
  email: string;
  role: Role;
  username: string;
  // isEmailConfirmed: boolean;
  // archived: boolean;
  loginType: LoginType;
}

export class LoggedUserInfoRefreshDto extends LoggedUserInfoDto {
  refreshToken: string;
}
