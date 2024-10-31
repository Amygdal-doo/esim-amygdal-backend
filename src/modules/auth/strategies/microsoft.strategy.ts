import { Injectable } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-microsoft';
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
    done,
  ): Promise<any> {
    const { id, displayName, emails } = profile;
    const user = {
      microsoftId: id,
      name: displayName,
      email: emails[0].value,
      accessToken,
    };
    done(null, user);
  }
}
