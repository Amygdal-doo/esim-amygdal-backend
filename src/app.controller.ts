import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('default')
@Controller({ path: '', version: '1' })
export class AppController {
  constructor(private readonly appService: AppService) {}
}
