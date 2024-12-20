import { Controller, Get, Query, UseFilters, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { WalletTransactionService } from './wallet-transaction.service';
import { UserLogged } from '../auth/decorators/user.decorator';
import { LoggedUserInfoDto } from '../auth/dtos/logged-user-info.dto';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { WalletTransactionResponseDto } from './dtos/responses/wallet_transaction.response.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { PaginationQueryDto, OrderType } from 'src/common/dtos/pagination.dto';

@ApiTags('Wallet Transaction')
@Controller({ path: 'wallet/transaction', version: '1' })
export class WalletTransactionController {
  constructor(
    private readonly walletTransactionService: WalletTransactionService,
  ) {}

  @Get('')
  @ApiOperation({
    summary: 'Get all wallet transactions paginated',
    description: 'Get all wallet transactions paginated for the logged in user',
  })
  @ApiBearerAuth('Access Token')
  @UseFilters(new HttpExceptionFilter())
  @UseGuards(AccessTokenGuard)
  @Serialize(WalletTransactionResponseDto)
  @ApiOkResponse({ type: WalletTransactionResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async paginated(
    @UserLogged() loggedUserInfoDto: LoggedUserInfoDto,
    @Query() paginationQuery: PaginationQueryDto,
    @Query() orderType: OrderType,
  ) {
    return this.walletTransactionService.findAllPaginated(
      paginationQuery,
      orderType,
      loggedUserInfoDto.id,
    );
  }
}
