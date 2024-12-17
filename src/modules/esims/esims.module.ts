import { Module } from '@nestjs/common';
import { EsimsController } from './esims.controller';
import { EsimsService } from './esims.service';
import { AiraloModule } from '../airalo/airalo.module';

@Module({
  imports: [AiraloModule],
  controllers: [EsimsController],
  providers: [EsimsService],
  exports: [EsimsService],
})
export class EsimsModule {}
