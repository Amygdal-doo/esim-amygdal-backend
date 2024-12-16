import { Module } from '@nestjs/common';
import { AiraloOrdersService } from './airalo_orders.service';
import { AiraloOrdersController } from './airalo_orders.controller';
import { AiraloModule } from '../airalo/airalo.module';

@Module({
  imports: [AiraloModule],
  providers: [AiraloOrdersService],
  controllers: [AiraloOrdersController],
  exports: [AiraloOrdersService],
})
export class AiraloOrdersModule {}
