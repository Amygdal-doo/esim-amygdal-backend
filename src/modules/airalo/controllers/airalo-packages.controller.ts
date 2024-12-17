import { Controller, Get, Query, UseFilters, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { AIRALO_PATH } from '../constants/path.constant';
import { AiraloPackagesService } from '../services/airalo-packages.service';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { UserLogged } from 'src/modules/auth/decorators/user.decorator';
import { LoggedUserInfoDto } from 'src/modules/auth/dtos/logged-user-info.dto';
import { AccessTokenGuard } from 'src/modules/auth/guards/access-token.guard';
import {
  GetPackageDto,
  GetPackagesDto,
} from '../dtos/requests/packages.request.dto';
import {
  CountryDto,
  PackageDto,
} from '../dtos/responses/synchronize_plans.response.dto';

@ApiTags(`Airalo Packages`)
@Controller({ path: `${AIRALO_PATH}/packages`, version: '1' })
export class AiraloPackagesController {
  constructor(private readonly airaloPackagesService: AiraloPackagesService) {}

  @Get('')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('Access Token')
  @UseFilters(new HttpExceptionFilter())
  @ApiOperation({ summary: 'Get packages' })
  @Serialize(CountryDto)
  @ApiOkResponse({ type: [CountryDto] })
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
    return await this.airaloPackagesService.getPackages(
      loggedUserInfoDto,
      query,
    );
  }

  @Get('/id')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('Access Token')
  @UseFilters(new HttpExceptionFilter())
  @ApiOperation({ summary: 'Get package by id' })
  @Serialize(PackageDto)
  @ApiOkResponse({ type: PackageDto })
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
  async getPackage(
    @UserLogged() loggedUserInfoDto: LoggedUserInfoDto,
    @Query() query: GetPackageDto,
  ) {
    return await this.airaloPackagesService.getPackageById(
      loggedUserInfoDto,
      query,
    );
  }
}
