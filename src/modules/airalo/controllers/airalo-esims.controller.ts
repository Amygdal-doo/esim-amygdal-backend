import {
  Controller,
  Get,
  Param,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AIRALO_PATH } from '../constants/path.constant';
import { AiraloEsimsService } from '../services/airalo-esims.service';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { UserLogged } from 'src/modules/auth/decorators/user.decorator';
import { LoggedUserInfoDto } from 'src/modules/auth/dtos/logged-user-info.dto';
import { AccessTokenGuard } from 'src/modules/auth/guards/access-token.guard';
import {
  GetSimsListDto,
  GetSimsDto,
} from '../dtos/requests/sims-list.request.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import {
  SimsListResponseDto,
  SimsResponseDto,
} from '../dtos/responses/sims.response.dto';
import { InstallationInstructionsResponseDto } from '../dtos/responses/instructions.response.dto';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { PermissionsGuard } from 'src/modules/auth/permission-guard/permissions.guard';

@ApiTags('Airalo e-sims')
@Controller({ path: `${AIRALO_PATH}/esims`, version: '1' })
export class AiraloEsimsController {
  constructor(private readonly airaloEsimsService: AiraloEsimsService) {}

  @Get('')
  @Roles(Role.SUPER_ADMIN)
  @UseGuards(AccessTokenGuard, PermissionsGuard)
  @ApiBearerAuth('Access Token')
  @UseFilters(new HttpExceptionFilter())
  @ApiOperation({ summary: 'Get sims list - super admin' })
  @Serialize(SimsListResponseDto)
  @ApiOkResponse({ type: SimsListResponseDto })
  async simsList(
    @Query() getSimsListDto: GetSimsListDto,
    @UserLogged() loggedUserInfoDto: LoggedUserInfoDto,
  ) {
    return this.airaloEsimsService.simsList(loggedUserInfoDto, getSimsListDto);
  }

  @Get(':sim_iccid')
  @Roles(Role.SUPER_ADMIN)
  @UseGuards(AccessTokenGuard, PermissionsGuard)
  @ApiBearerAuth('Access Token')
  @UseFilters(new HttpExceptionFilter())
  @ApiOperation({ summary: 'Get sim by iccid - super admin' })
  @Serialize(SimsResponseDto)
  @ApiOkResponse({ type: SimsResponseDto })
  async simsByIccid(
    @Param('sim_iccid') sim_iccid: string,
    @Query() getSimsDto: GetSimsDto,
    @UserLogged() loggedUserInfoDto: LoggedUserInfoDto,
  ) {
    return this.airaloEsimsService.simsByIccid(
      loggedUserInfoDto,
      sim_iccid,
      getSimsDto,
    );
  }

  @Get(':sim_iccid/instructions')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('Access Token')
  @UseFilters(new HttpExceptionFilter())
  @ApiOperation({ summary: 'Get sim instructions' })
  @Serialize(InstallationInstructionsResponseDto)
  @ApiOkResponse({ type: InstallationInstructionsResponseDto })
  async getInstructions(
    @UserLogged() loggedUserInfoDto: LoggedUserInfoDto,
    @Param('sim_iccid') sim_iccid: string,
    @Query('lang') lang: string = 'en',
  ) {
    return await this.airaloEsimsService.getInstructions(
      loggedUserInfoDto,
      sim_iccid,
      lang,
    );
  }
}
