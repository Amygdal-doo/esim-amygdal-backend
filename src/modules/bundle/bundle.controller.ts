import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { BundleService } from './bundle.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PaginationQueryDto, OrderType } from 'src/common/dtos/pagination.dto';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import {
  BundlePaginationResponseDto,
  BundleResponseDto,
} from './dtos/responses/bundle.response.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { CreateBundleDto } from './dtos/requests/create-bundle.dto';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { PermissionsGuard } from '../auth/permission-guard/permissions.guard';

@ApiTags('bundle')
@Controller({ path: 'bundle', version: '1' })
export class BundleController {
  constructor(private readonly bundleService: BundleService) {}

  @Post('')
  @Roles(Role.SUPER_ADMIN)
  @UseGuards(AccessTokenGuard, PermissionsGuard)
  @ApiBearerAuth('Access Token')
  @ApiOperation({
    summary: 'Create bundle - SUPER_ADMIN',
    description: 'Create bundle',
  })
  @UseFilters(new HttpExceptionFilter())
  @Serialize(BundleResponseDto)
  @ApiCreatedResponse({ type: BundleResponseDto })
  async create(
    // @UserLogged() LoggedUserInfoDto: LoggedUserInfoDto,
    @Body() createBundleDto: CreateBundleDto,
  ) {
    return this.bundleService.create(createBundleDto);
  }

  @Get('')
  @ApiOperation({
    summary: 'Get all credit bundles',
    description: 'Get all bundles',
  })
  @UseFilters(new HttpExceptionFilter())
  @Serialize(BundlePaginationResponseDto)
  @ApiOkResponse({ type: BundlePaginationResponseDto })
  async paginated(
    @Query() paginationQuery: PaginationQueryDto,
    @Query() orderType: OrderType,
  ) {
    return this.bundleService.findAllPaginated(paginationQuery, orderType);
  }

  @Put(':id')
  @Roles(Role.SUPER_ADMIN)
  @UseGuards(AccessTokenGuard, PermissionsGuard)
  @ApiBearerAuth('Access Token')
  @ApiOperation({
    summary: 'Update bundle - SUPER_ADMIN',
    description: 'Update bundle',
  })
  @UseFilters(new HttpExceptionFilter())
  @Serialize(BundleResponseDto)
  @ApiCreatedResponse({ type: BundleResponseDto })
  async update(
    @Body() createBundleDto: CreateBundleDto,
    @Param('id') id: string,
  ) {
    return this.bundleService.update(id, createBundleDto);
  }
}
