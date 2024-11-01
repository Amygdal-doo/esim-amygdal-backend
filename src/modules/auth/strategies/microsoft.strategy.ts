import { Injectable } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-microsoft';
import { SocialUserType } from '../interfaces/social-user-object.interface';
ConfigModule.forRoot();

@Injectable()
export class MicrosoftStrategy extends PassportStrategy(Strategy, 'microsoft') {
  constructor(private readonly config: ConfigService) {
    super({
      clientID: config.get<string>('MICROSOFT_CLIENT_ID'),
      clientSecret: config.get<string>('MICROSOFT_CLIENT_SECRET'),
      callbackURL:
        config.get<string>('DEV_URL') + '/api/v1/auth/microsoft/redirect',
      scope: ['user.read'], // Adjust scope as needed
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (err: any, user: any) => void,
  ): Promise<any> {
    const { id, emails, name } = profile;

    const user: SocialUserType = {
      microsoftId: id,
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      accessToken,
    };
    done(null, user);
  }
}
