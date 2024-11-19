import { Controller, Get, Query, UseFilters, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { AiraloService } from './airalo.service';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { CountryDto } from './dtos/responses/synchronize_plans.response.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { UserLogged } from '../auth/decorators/user.decorator';
import { LoggedUserInfoDto } from '../auth/dtos/logged-user-info.dto';
import { GetPackagesDto } from './dtos/requests/packages.request.dto';

@ApiTags('Airalo')
@Controller({ path: 'airalo', version: '1' })
export class AiraloController {
  constructor(private readonly airaloService: AiraloService) {}

  // @Get('token')
  // @ApiOperation({ summary: 'Get Airalo token' })
  // // @Serialize(AiraloTokenResponseDto)
  // // @ApiOkResponse({ type: AiraloTokenResponseDto })
  // // @ApiUnprocessableEntityResponse({
  // //   description: 'Invalid credentials',
  // //   example: {
  // //     data: {
  // //       client_id: 'Your account is terminated.',
  // //     },
  // //     meta: {
  // //       message: 'the parameter is invalid',
  // //     },
  // //   },
  // // })
  // async getToken() {
  //   return await this.airaloService.getToken();
  // }

  @Get('packages')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('Access Token')
  @UseFilters(new HttpExceptionFilter())
  @ApiOperation({ summary: 'Get Airalo token' })
  @Serialize(CountryDto)
  @ApiOkResponse({ type: CountryDto })
  @ApiForbiddenResponse()
  @ApiUnprocessableEntityResponse({
    description: 'Invalid credentials',
    example: {
      data: {
        client_id: 'The limit must be an integer.',
      },
      meta: {
        message: 'the parameter is invalid',
      },
    },
  })
  async getPackages(
    @UserLogged() loggedUserInfoDto: LoggedUserInfoDto,
    @Query() query: GetPackagesDto,
  ) {
    return await this.airaloService.getPackages(loggedUserInfoDto, query);
  }
}
