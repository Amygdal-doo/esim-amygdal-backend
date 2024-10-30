import { Controller, Get } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { AiraloService } from './airalo.service';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { AiraloTokenDataDto } from './dtos/responses/token-response.dto';

@ApiTags('Airalo')
@Controller({ path: 'airalo', version: '1' })
export class AiraloController {
  constructor(private readonly airaloService: AiraloService) {}

  @Get('token')
  @ApiOperation({ summary: 'Get Airalo token' })
  @Serialize(AiraloTokenDataDto)
  @ApiOkResponse({ type: AiraloTokenDataDto })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid credentials',
    example: {
      data: {
        client_id: 'Your account is terminated.',
      },
      meta: {
        message: 'the parameter is invalid',
      },
    },
  })
  async get() {
    return await this.airaloService.getToken();
  }
}
