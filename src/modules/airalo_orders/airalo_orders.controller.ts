import { Controller, Get, Param, UseFilters, UseGuards } from '@nestjs/common';
import { AiraloOrdersService } from './airalo_orders.service';
import { UserLogged } from '../auth/decorators/user.decorator';
import { LoggedUserInfoDto } from '../auth/dtos/logged-user-info.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { OrderListResponseDto } from '../airalo/dtos/responses/order.response';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';

@ApiTags('Airalo Orders')
@Controller({ path: 'Airalo/orders', version: '1' })
export class AiraloOrdersController {
  constructor(private readonly ordersService: AiraloOrdersService) {}

  // @Post()
  // // @Roles(Role.SUPER_ADMIN)
  // @UseGuards(AccessTokenGuard)
  // @ApiBearerAuth('Access Token')
  // @UseFilters(new HttpExceptionFilter())
  // @ApiOperation({ summary: 'Create a new Order' })
  // // @Serialize(OrderListResponseDto)
  // @ApiOkResponse({ type: OrderListResponseDto })
  // @ApiForbiddenResponse()
  // async create(
  //   @Body() createOrderDto: CreateOrderDto,
  //   @UserLogged() loggedUserInfoDto: LoggedUserInfoDto,
  // ) {
  //   return this.ordersService.createOrder(loggedUserInfoDto.id, createOrderDto);
  // }

  @Get()
  // @Roles(Role.SUPER_ADMIN)
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('Access Token')
  @UseFilters(new HttpExceptionFilter())
  @ApiOperation({ summary: 'Get My orders' })
  // @Serialize(OrderListResponseDto)
  // @ApiOkResponse({ type: OrderListResponseDto })
  // @ApiForbiddenResponse()
  async getOrders(@UserLogged() loggedUserInfoDto: LoggedUserInfoDto) {
    return this.ordersService.getMyOrders(loggedUserInfoDto);
  }

  @Get(':id')
  // @Roles(Role.SUPER_ADMIN)
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('Access Token')
  @UseFilters(new HttpExceptionFilter())
  @ApiOperation({ summary: 'Get My order by Id' })
  // @Serialize(OrderListResponseDto)
  @ApiOkResponse({ type: OrderListResponseDto })
  @ApiForbiddenResponse()
  async getOrder(
    @UserLogged() loggedUserInfoDto: LoggedUserInfoDto,
    @Param('id') id: string,
  ) {
    return this.ordersService.getOrder(loggedUserInfoDto, id);
  }
}
