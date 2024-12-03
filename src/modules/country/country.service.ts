import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CountryResponseDto } from './dtos/responses/country.response.dto';
import {
  OrderType,
  PaginationQueryDto,
  PaginationResponseDto,
} from 'src/common/dtos/pagination.dto';
import { SortOrder } from 'src/common/enums/order.enum';
import { Prisma } from '@prisma/client';
import { pageLimit } from 'src/common/helpers/pagination.helper';

@Injectable()
export class CountryService {
  constructor(private readonly databaseService: DatabaseService) {}

  private readonly countryModel = this.databaseService.country;

  async findAll(): Promise<CountryResponseDto[]> {
    return await this.countryModel.findMany({
      include: {
        image: true,
        currency: true,
        language: true,
      },
    });
  }

  async findAllPaginated(
    paginationQuery: PaginationQueryDto,
    orderType: OrderType,
  ): Promise<PaginationResponseDto> {
    const orderIn = orderType.type ? orderType.type : SortOrder.ASCENDING;
    const orderBy = 'title';
    const query: Prisma.CountryFindManyArgs = {
      where: {
        // name: { contains: paginationQuery.name, mode: 'insensitive' },
      },
    };

    const { page, limit } = pageLimit(paginationQuery);
    const total = await this.countryModel.count({
      where: query.where,
    });

    const pages = Math.ceil(total / limit);
    const startIndex = page < 1 ? 0 : (page - 1) * limit;

    const results = await this.countryModel.findMany({
      include: {
        image: true,
        currency: true,
        language: true,
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
