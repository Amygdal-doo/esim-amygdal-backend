import { Module } from '@nestjs/common';
import { AiraloService } from './services/airalo.service';
import { HttpModule } from '@nestjs/axios';
import { AiraloController } from './controllers/airalo.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { AiraloEsimsService } from './services/airalo-esims.service';
import { AiraloOrdersApiService } from './services/airalo-orders.service';
import { AiraloPackagesService } from './services/airalo-packages.service';
import { AiraloEsimsController } from './controllers/airalo-esims.controller';
import { AiraloPackagesController } from './controllers/airalo-packages.controller';
import { AiraloOrdersController } from './controllers/airalo-orders.controller';

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
  providers: [
    AiraloService,
    AiraloEsimsService,
    AiraloOrdersApiService,
    AiraloPackagesService,
  ],
  controllers: [
    AiraloController,
    AiraloEsimsController,
    AiraloPackagesController,
    AiraloOrdersController,
  ],
  exports: [
    AiraloService,
    AiraloEsimsService,
    AiraloOrdersApiService,
    AiraloPackagesService,
  ],
})
export class AiraloModule {}
