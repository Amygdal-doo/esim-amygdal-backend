import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AIRALO_PATH } from '../constants/path.constant';
import { AiraloOrdersApiService } from '../services/airalo-orders.service';
import { LoggedUserInfoDto } from 'src/modules/auth/dtos/logged-user-info.dto';
import { UserLogged } from 'src/modules/auth/decorators/user.decorator';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { AccessTokenGuard } from 'src/modules/auth/guards/access-token.guard';
import { PermissionsGuard } from 'src/modules/auth/permission-guard/permissions.guard';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { OrderListResponseDto } from '../dtos/responses/order.response';
import {
  OrderListQueryDto,
  OrderQueryDto,
} from '../dtos/requests/orders-list.request.dto';

@ApiTags('Airalo Orders')
@Controller({ path: `${AIRALO_PATH}/orders`, version: '1' })
export class AiraloOrdersController {
  constructor(private readonly airaloOrdersService: AiraloOrdersApiService) {}

  @Get()
  @Roles(Role.SUPER_ADMIN)
  @UseGuards(AccessTokenGuard, PermissionsGuard)
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('Access Token')
  @UseFilters(new HttpExceptionFilter())
  @ApiOperation({ summary: 'Get Orders - Super Admin' })
  @Serialize(OrderListResponseDto)
  @ApiOkResponse({ type: OrderListResponseDto })
  @ApiForbiddenResponse()
  async getOrders(
    @UserLogged() loggedUserInfoDto: LoggedUserInfoDto,
    @Query() query: OrderListQueryDto,
  ) {
    return await this.airaloOrdersService.getOrders(loggedUserInfoDto, query);
  }

  @Get(':order_id')
  @Roles(Role.SUPER_ADMIN)
  @UseGuards(AccessTokenGuard, PermissionsGuard)
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('Access Token')
  @UseFilters(new HttpExceptionFilter())
  @ApiOperation({ summary: 'Get Orders - Super Admin' })
  @Serialize(OrderListResponseDto)
  @ApiOkResponse({ type: OrderListResponseDto })
  @ApiForbiddenResponse()
  async getOrder(
    @UserLogged() loggedUserInfoDto: LoggedUserInfoDto,
    @Query() query: OrderQueryDto,
    @Param('order_id', ParseIntPipe) orderId: number,
  ) {
    return await this.airaloOrdersService.getOrder(
      loggedUserInfoDto,
      query,
      orderId,
    );
  }
}
