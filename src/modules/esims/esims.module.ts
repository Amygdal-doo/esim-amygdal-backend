import { Module } from '@nestjs/common';
import { EsimsController } from './esims.controller';
import { EsimsService } from './esims.service';

@Module({
  controllers: [EsimsController],
  providers: [EsimsService],
  exports: [EsimsService],
})
export class EsimsModule {}
