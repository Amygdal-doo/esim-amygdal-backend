import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WalletTransactionService } from './wallet-transaction.service';

@ApiTags('Wallet Transaction')
@Controller({ path: 'wallet/transaction', version: '1' })
export class WalletTransactionController {
  constructor(
    private readonly walletTransactionService: WalletTransactionService,
  ) {}
}
