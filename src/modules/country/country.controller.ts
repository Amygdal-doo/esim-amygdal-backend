import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CountryService } from './country.service';
import {
  CountryPaginationResponseDto,
  CountryResponseDto,
} from './dtos/responses/country.response.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { OrderType, PaginationQueryDto } from 'src/common/dtos/pagination.dto';

@ApiTags('Country')
@Controller({ path: 'countries', version: '1' })
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get('all')
  @ApiOkResponse({ type: [CountryResponseDto] })
  @Serialize(CountryResponseDto)
  @ApiOperation({ summary: 'Get all countries' })
  async getCountries() {
    return await this.countryService.findAll();
  }

  @Get('search')
  @ApiOkResponse({ type: [CountryResponseDto] })
  @Serialize(CountryResponseDto)
  @ApiOperation({ summary: 'Search countries' })
  async searchCountries(@Query('query') query: string) {
    return await this.countryService.search(query);
  }

  @Get()
  @ApiOkResponse({ type: CountryPaginationResponseDto })
  @Serialize(CountryPaginationResponseDto)
  @ApiOperation({ summary: 'Get all countries paginated' })
  async getCountriesPaginated(
    @Query() paginationQuery: PaginationQueryDto,
    @Query() orderType: OrderType,
  ) {
    return await this.countryService.findAllPaginated(
      paginationQuery,
      orderType,
    );
  }
}
