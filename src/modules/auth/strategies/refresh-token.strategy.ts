import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayloadDto } from '../dtos/jwt-payload.dto';
import { UserService } from 'src/modules/user/services/user.service';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    config: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_REFRESH_SECRET'), //JWT_SECRET
      signOptions: {
        expiresIn: config.get<string>('REFRESH_TOKEN_EXPIRES_IN'),
      },
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayloadDto) {
    const user = await this.userService.findById(payload.id);

    // if (user?.archived) return false;

    const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
    if (!refreshToken) throw new ForbiddenException('Refresh token malformed');

    // Update user props if changes have been made ß
    payload.role = user?.role;
    payload.email = user?.email;
    payload.isEmailConfirmed = user?.isEmailConfirmed;
    payload.username = user?.username;
    payload.loginType = user?.loginType;

    const { exp, iat, ...rest } = payload;
    return {
      ...rest,
      refreshToken,
    };
  }
}
