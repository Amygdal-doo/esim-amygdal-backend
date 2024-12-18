import { Module } from '@nestjs/common';
import { WalletTransactionController } from './wallet-transaction.controller';
import { WalletTransactionService } from './wallet-transaction.service';

@Module({
  controllers: [WalletTransactionController],
  providers: [WalletTransactionService],
})
export class WalletTransactionModule {}
