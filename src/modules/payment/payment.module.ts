import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { MonriOrdersModule } from '../monri_orders/monri_orders.module';
import { AiraloOrdersModule } from '../airalo_orders/airalo_orders.module';
import { UserModule } from '../user/user.module';
import { BundleModule } from '../bundle/bundle.module';

@Module({
  imports: [MonriOrdersModule, AiraloOrdersModule, UserModule, BundleModule],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
