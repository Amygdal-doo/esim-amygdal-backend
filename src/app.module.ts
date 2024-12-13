import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { rateLimitoptions } from './common/config';
import { HttpLoggerMiddleware } from './middleware/logging/logging.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { DatabaseModule } from './database/database.module';
import { AiraloModule } from './modules/airalo/airalo.module';
import { EsimsModule } from './modules/esims/esims.module';
import { OrdersModule } from './modules/orders/orders.module';
import { CountryModule } from './modules/country/country.module';
import { SendgridModule } from './modules/sendgrid/sendgrid.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([rateLimitoptions]),
    DatabaseModule,
    AuthModule,
    UserModule,
    AiraloModule,
    EsimsModule,
    OrdersModule,
    CountryModule,
    SendgridModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
