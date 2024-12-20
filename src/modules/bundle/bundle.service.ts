import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  OrderType,
  PaginationQueryDto,
  PaginationResponseDto,
} from 'src/common/dtos/pagination.dto';
import { SortOrder } from 'src/common/enums/order.enum';
import { pageLimit } from 'src/common/helpers/pagination.helper';
import { DatabaseService } from 'src/database/database.service';
import { CreateBundleDto } from './dtos/requests/create-bundle.dto';
import { UpdateBundleDto } from './dtos/requests/update-bundle.dto';

@Injectable()
export class BundleService {
  constructor(private readonly databaseService: DatabaseService) {}

  private readonly bundleModel = this.databaseService.creditBundle;

  async findById(id: string) {
    return this.bundleModel.findUnique({
      where: { id, isActive: true },
    });
  }

  async findAllPaginated(
    paginationQuery: PaginationQueryDto,
    orderType: OrderType,
  ): Promise<PaginationResponseDto> {
    const orderIn = orderType.type ? orderType.type : SortOrder.ASCENDING;
    const orderBy = 'price';
    const query: Prisma.CreditBundleFindManyArgs = {
      where: {},
    };

    const { page, limit } = pageLimit(paginationQuery);
    const total = await this.bundleModel.count({
      where: query.where,
    });

    const pages = Math.ceil(total / limit);
    const startIndex = page < 1 ? 0 : (page - 1) * limit;

    const results = await this.bundleModel.findMany({
      where: query.where,
      skip: startIndex,
      take: limit,
      orderBy: {
        [orderBy]: orderIn,
      },
    });
    return { limit, page, pages, total, results };
  }

  async create(data: CreateBundleDto) {
    return this.bundleModel.create({ data });
  }

  async update(id: string, data: UpdateBundleDto) {
    const bundle = await this.findById(id);
    if (!bundle) throw new NotFoundException();
    return this.bundleModel.update({ where: { id }, data });
  }
}
