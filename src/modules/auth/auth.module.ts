import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { PassportModule } from '@nestjs/passport';
import { AppleStrategy } from './strategies/apple.strategy';
import { MicrosoftStrategy } from './strategies/microsoft.strategy';
import { AiraloModule } from '../airalo/airalo.module';
import { SendgridModule } from '../sendgrid/sendgrid.module';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      /*secret: process.env.JWT_SECRET,
    signOptions: {
      expiresIn: process.env.EXPIRES_IN,
    },*/
    }),
    AiraloModule,
    SendgridModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    GoogleStrategy,
    AppleStrategy,
    MicrosoftStrategy,
  ],
})
export class AuthModule {}
