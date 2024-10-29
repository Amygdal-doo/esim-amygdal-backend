import { LoggedUserInfoDto } from './logged-user-info.dto';

export class JwtPayloadDto extends LoggedUserInfoDto {
  iat: number;
  exp: number;
}
