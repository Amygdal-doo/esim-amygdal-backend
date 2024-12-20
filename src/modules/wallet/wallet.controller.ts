import {
  Controller,
  Get,
  HttpCode,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { UserLogged } from '../auth/decorators/user.decorator';
import { LoggedUserInfoDto } from '../auth/dtos/logged-user-info.dto';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { WalletResponseDto } from './dtos/responses/wallet.response.dto';

@ApiTags('Wallet')
@Controller({ path: 'wallet', version: '1' })
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('me')
  @ApiOperation({
    summary: 'Get wallet Information',
    description: 'Get wallet Information from Logged User',
  })
  @ApiBearerAuth('Access Token')
  @UseFilters(new HttpExceptionFilter())
  @UseGuards(AccessTokenGuard)
  @Serialize(WalletResponseDto)
  @ApiOkResponse({ type: WalletResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @HttpCode(200)
  async getWallet(@UserLogged() loggedUserInfoDto: LoggedUserInfoDto) {
    return await this.walletService.findByUserId(loggedUserInfoDto.id);
  }
}
