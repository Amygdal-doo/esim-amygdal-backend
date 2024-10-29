export class LoginResponseDto {
  accessToken: string;
  refreshToken: string;
}

export class LoginResponseExpireDto extends LoginResponseDto {
  accessTokenExpires: number;
}
