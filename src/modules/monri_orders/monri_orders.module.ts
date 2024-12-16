import { Module } from '@nestjs/common';
import { MonriOrdersController } from './monri_orders.controller';
import { MonriOrdersService } from './monri_orders.service';

@Module({
  controllers: [MonriOrdersController],
  providers: [MonriOrdersService],
  exports: [MonriOrdersService],
})
export class MonriOrdersModule {}
