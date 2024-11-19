import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './services/user.service';
import { UserRefreshTokenService } from './services/user-refresh-token.service';
import { UserAiraloTokenService } from './services/user-airalo-token.service';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRefreshTokenService, UserAiraloTokenService],
  exports: [UserService, UserRefreshTokenService, UserAiraloTokenService],
})
export class UserModule {}
