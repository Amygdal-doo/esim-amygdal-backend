import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  OrderType,
  PaginationQueryDto,
  PaginationResponseDto,
} from 'src/common/dtos/pagination.dto';
import { SortOrder } from 'src/common/enums/order.enum';
import { pageLimit } from 'src/common/helpers/pagination.helper';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class WalletTransactionService {
  constructor(private readonly databaseService: DatabaseService) {}

  private walletTransactionModel = this.databaseService.walletTransaction;

  async findById(id: string) {
    return this.walletTransactionModel.findUnique({ where: { id } });
  }

  async update(id: string, data: Prisma.WalletTransactionUpdateInput) {
    return this.walletTransactionModel.update({ where: { id }, data });
  }

  async findAll(userId: string) {
    return this.walletTransactionModel.findMany({
      where: {
        userId,
      },
    });
  }

  async findAllPaginated(
    paginationQuery: PaginationQueryDto,
    orderType: OrderType,
    userId: string,
  ): Promise<PaginationResponseDto> {
    const orderIn = orderType.type ? orderType.type : SortOrder.ASCENDING;
    const orderBy = 'createdAt';
    const query: Prisma.WalletTransactionFindManyArgs = {
      where: {
        userId,
        // name: { contains: paginationQuery.name, mode: 'insensitive' },
      },
    };

    const { page, limit } = pageLimit(paginationQuery);
    const total = await this.walletTransactionModel.count({
      where: query.where,
    });

    const pages = Math.ceil(total / limit);
    const startIndex = page < 1 ? 0 : (page - 1) * limit;

    const results = await this.walletTransactionModel.findMany({
      include: {
        user: true,
        airaloOrder: true,
        monriOrder: true,
      },
      where: query.where,
      skip: startIndex,
      take: limit,
      orderBy: {
        [orderBy]: orderIn,
      },
    });
    return { limit, page, pages, total, results };
  }
}
