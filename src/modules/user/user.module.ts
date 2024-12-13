import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserRefreshTokenService } from './services/user-refresh-token.service';
import { UserAiraloTokenService } from './services/user-airalo-token.service';
import { UserProfileService } from './services/user-profile.service';
import { UserProfileController } from './controllers/profile.controller';
import { UserResetPasswordTokenService } from './services/user-reset-password-token.service';

@Module({
  controllers: [UserController, UserProfileController],
  providers: [
    UserService,
    UserRefreshTokenService,
    UserAiraloTokenService,
    UserProfileService,
    UserResetPasswordTokenService,
  ],
  exports: [
    UserService,
    UserRefreshTokenService,
    UserAiraloTokenService,
    UserProfileService,
    UserResetPasswordTokenService,
  ],
})
export class UserModule {}
