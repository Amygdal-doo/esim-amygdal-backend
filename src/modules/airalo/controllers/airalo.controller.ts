import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { AiraloService } from '../services/airalo.service';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { AiraloTokenResponseDto } from '../dtos/responses/token-response.dto';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { AccessTokenGuard } from 'src/modules/auth/guards/access-token.guard';
import { PermissionsGuard } from 'src/modules/auth/permission-guard/permissions.guard';

@ApiTags('Airalo')
@Controller({ path: 'airalo', version: '1' })
export class AiraloController {
  constructor(private readonly airaloService: AiraloService) {}

  @Get('token')
  @ApiBearerAuth('Access Token')
  @Roles(Role.SUPER_ADMIN)
  @UseGuards(AccessTokenGuard, PermissionsGuard)
  @ApiOperation({ summary: 'Get Airalo token' })
  @Serialize(AiraloTokenResponseDto)
  @ApiOkResponse({ type: AiraloTokenResponseDto })
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
  async getToken() {
    return await this.airaloService.getToken();
  }
}
