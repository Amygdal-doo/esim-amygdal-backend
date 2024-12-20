import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class WalletService {
  constructor(private readonly databaseService: DatabaseService) {}

  private readonly walletModel = this.databaseService.wallet;

  async findByUserId(userId: string) {
    return await this.walletModel.findUnique({ where: { userId } });
  }

  async findById(id: string) {
    return await this.walletModel.findUnique({ where: { id } });
  }

  async updateByUserId(userId: string, data: Prisma.WalletUpdateInput) {
    return await this.walletModel.update({ where: { userId }, data });
  }

  async updateBalanceByUserId(userId: string, balance: number) {
    return await this.walletModel.update({
      where: { userId },
      data: { balance },
    });
  }
}
