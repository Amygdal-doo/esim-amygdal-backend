import { Body, Controller, Post, UseFilters, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { UserLogged } from '../auth/decorators/user.decorator';
import { LoggedUserInfoDto } from '../auth/dtos/logged-user-info.dto';
import { CreateOrderDto } from '../airalo/dtos/requests/create-order.request.dto';
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

@ApiTags('Orders')
@Controller({ path: 'orders', version: '1' })
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  // @Roles(Role.SUPER_ADMIN)
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('Access Token')
  @UseFilters(new HttpExceptionFilter())
  @ApiOperation({ summary: 'Create a new Order' })
  // @Serialize(OrderListResponseDto)
  @ApiOkResponse({ type: OrderListResponseDto })
  @ApiForbiddenResponse()
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @UserLogged() loggedUserInfoDto: LoggedUserInfoDto,
  ) {
    return this.ordersService.createOrder(loggedUserInfoDto, createOrderDto);
  }
}
