import { Module } from '@nestjs/common';
import { AiraloService } from './airalo.service';
import { HttpModule } from '@nestjs/axios';
import { AiraloController } from './airalo.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get('HTTP_TIMEOUT'),
        maxRedirects: configService.get('HTTP_MAX_REDIRECTS'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],
  providers: [AiraloService],
  controllers: [AiraloController],
  exports: [AiraloService],
})
export class AiraloModule {}
