import { Controller, Get, Param, UseFilters, UseGuards } from '@nestjs/common';
import { EsimsService } from './esims.service';
import { UserLogged } from '../auth/decorators/user.decorator';
import { LoggedUserInfoDto } from '../auth/dtos/logged-user-info.dto';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { DataDto } from '../airalo/dtos/responses/sim-status.response.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { EsimResponseDto } from './dtos/responses/esim.response.dto';

@ApiTags('esims')
@Controller({ path: 'esims', version: '1' })
export class EsimsController {
  constructor(private readonly esimsService: EsimsService) {}

  @Get('')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('Access Token')
  @UseFilters(new HttpExceptionFilter())
  @ApiOperation({ summary: 'Get My esim list by user' })
  @Serialize(EsimResponseDto)
  @ApiOkResponse({ type: [EsimResponseDto] })
  @ApiForbiddenResponse()
  async findAll(@UserLogged() loggedUserInfoDto: LoggedUserInfoDto) {
    return await this.esimsService.findAll(loggedUserInfoDto.id);
  }

  @Get('usage/:iccid')
  // @Roles(Role.SUPER_ADMIN)
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('Access Token')
  @UseFilters(new HttpExceptionFilter())
  @ApiOperation({ summary: 'Get My sim data usage by iccid' })
  @Serialize(DataDto)
  @ApiOkResponse({ type: DataDto })
  @ApiNotFoundResponse()
  @ApiTooManyRequestsResponse()
  @ApiForbiddenResponse()
  async usage(
    @UserLogged() loggedUserInfoDto: LoggedUserInfoDto,
    @Param('iccid') iccid: string,
  ) {
    return await this.esimsService.usage(loggedUserInfoDto, iccid);
  }

  @Get(':id')
  // @Roles(Role.SUPER_ADMIN)
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('Access Token')
  @UseFilters(new HttpExceptionFilter())
  @ApiOperation({ summary: 'Get My esim by id' })
  @Serialize(EsimResponseDto)
  @ApiOkResponse({ type: EsimResponseDto })
  @ApiForbiddenResponse()
  async findById(
    @UserLogged() loggedUserInfoDto: LoggedUserInfoDto,
    @Param('id') id: string,
  ) {
    return await this.esimsService.findById(loggedUserInfoDto.id, id);
  }
}
