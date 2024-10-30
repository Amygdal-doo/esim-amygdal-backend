import { Module } from '@nestjs/common';
import { AiraloService } from './airalo.service';
import { HttpModule } from '@nestjs/axios';
import { AiraloController } from './airalo.controller';

@Module({
  imports: [HttpModule],
  providers: [AiraloService],
  controllers: [AiraloController],
})
export class AiraloModule {}
