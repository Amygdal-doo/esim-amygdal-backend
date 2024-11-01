import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  Profile,
  Strategy,
  //   VerifyCallback,
} from '@arendajaelu/nestjs-passport-apple';
import { ConfigService } from '@nestjs/config';
import { SocialUserType } from '../interfaces/social-user-object.interface';

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy, 'apple') {
  /*************  ✨ Codeium Command ⭐  *************/
  /**
   * Creates an instance of the AppleStrategy, given an instance of a ConfigService.
   * @param config The instance of the ConfigService.
   * @constructor
   */
  /******  f617b6c5-ac45-4c76-9597-4717f347f5e1  *******/
  constructor(config: ConfigService) {
    super({
      clientID: config.get<string>('APPLE_CLIENTID'),
      teamID: config.get<string>('APPLE_TEAMID'),
      keyID: config.get<string>('APPLE_KEYID'),
      keyFilePath: config.get<string>('APPLE_KEYFILE_PATH'),
      callbackURL:
        config.get<string>('APPLE_CALLBACK') + '/api/v1/auth/apple/redirect',
      passReqToCallback: false,
      scope: ['email', 'name'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    // done: VerifyCallback,
  ): Promise<SocialUserType> {
    const { name, email, id } = profile;

    const user: SocialUserType = {
      appleId: id,
      email: email ? email : '',
      firstName: name?.firstName ? name?.firstName : '',
      lastName: name?.lastName ? name?.lastName : '',
      //picture: photos[0].value,
      accessToken,
    };
    // done(null, user);
    return user;
  }
}
