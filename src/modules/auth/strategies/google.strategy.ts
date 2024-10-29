import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SocialUserType } from '../interfaces/social-user-object.interface';

ConfigModule.forRoot();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      clientID: config.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: config.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL:
        config.get<string>('DEV_URL') + '/api/v1/auth/google/redirect',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<void> {
    const { name, emails, photos, id } = profile;
    //console.log(refreshToken);
    // console.log(params);

    const user: SocialUserType = {
      googleId: id,
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      //picture: photos[0].value,
      accessToken,
    };
    done(null, user);
  }
}
