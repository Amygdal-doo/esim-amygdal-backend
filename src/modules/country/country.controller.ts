import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CountryService } from './country.service';
import { CountryResponseDto } from './dtos/responses/country.response.dto';

@ApiTags('Country')
@Controller({ path: 'country', version: '1' })
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  @ApiOkResponse({ type: [CountryResponseDto] })
  @ApiOperation({ summary: 'Get all countries' })
  async getCountries() {
    return await this.countryService.getCountries();
  }
}
