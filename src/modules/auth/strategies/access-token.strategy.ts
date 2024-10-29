import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayloadDto } from '../dtos/jwt-payload.dto';
import { UserService } from 'src/modules/user/user.service';

// type JwtPayload = {
//   sub: string;
//   username: string;
// };

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_ACCESS_SECRET'), //JWT_SECRET
      signOptions: {
        expiresIn: config.get<string>('EXPIRES_IN'),
      },
    });
  }

  async validate(payload: JwtPayloadDto) {
    const user = await this.userService.findById(payload.id);

    // if (user?.archived) return false;
    // Update user props if changes have been made
    payload.role = user?.role;
    payload.email = user?.email;
    payload.username = user?.username;
    payload.loginType = user?.loginType;

    const { exp, iat, ...rest } = payload;
    return {
      ...rest,
    };
  }
}
