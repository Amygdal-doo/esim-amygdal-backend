import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CountryResponseDto } from './dtos/responses/country.response.dto';

@Injectable()
export class CountryService {
  constructor(private readonly databaseService: DatabaseService) {}

  private readonly countryModel = this.databaseService.country;

  async getCountries(): Promise<CountryResponseDto[]> {
    return await this.countryModel.findMany({
      include: {
        image: true,
        currency: true,
        language: true,
      },
    });
  }
}
