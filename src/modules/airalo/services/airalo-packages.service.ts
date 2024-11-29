import { HttpService } from '@nestjs/axios';
import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError, AxiosResponse } from 'axios';
import { plainToInstance } from 'class-transformer';
import { catchError, firstValueFrom, lastValueFrom } from 'rxjs';
import { LoggedUserInfoDto } from 'src/modules/auth/dtos/logged-user-info.dto';
import { UserAiraloTokenService } from 'src/modules/user/services/user-airalo-token.service';
import { AIRALO_ENDPOINTS } from '../constants/url.constants';
import { GetPackagesDto } from '../dtos/requests/packages.request.dto';
import {
  CountryDto,
  SynchronizePlansResponseDto,
} from '../dtos/responses/synchronize_plans.response.dto';
import { AiraloService } from './airalo.service';

@Injectable()
export class AiraloPackagesService {
  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
    private readonly airaloTokenService: UserAiraloTokenService,
    private readonly airaloService: AiraloService,
  ) {}

  async getPackages(
    loggedUser: LoggedUserInfoDto,
    query: GetPackagesDto,
  ): Promise<CountryDto[]> {
    const decodedToken = await this.airaloService.getOrRefreshToken(
      loggedUser.id,
    );

    try {
      // Construct query parameters
      const queryParams = {
        ...(query.filterType && { 'filter[type]': query.filterType }),
        ...(query.filterCountry && { 'filter[country]': query.filterCountry }),
        ...(query.limit && { limit: query.limit }),
        ...(query.page && { page: query.page }),
        ...(query.include && { include: query.include }),
      };

      const response = await lastValueFrom(
        this.httpService.get<AxiosResponse<SynchronizePlansResponseDto>>(
          `${this.config.get<string>('AIRALO_URL_SANDBOX')}/v2${AIRALO_ENDPOINTS.PACKAGES}`,
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded',
              Authorization: `Bearer ${decodedToken}`,
            },
            params: queryParams, // Add query parameters here
          },
        ),
      );

      const parsedResponse = plainToInstance(
        SynchronizePlansResponseDto,
        response.data,
        {
          enableCircularCheck: true,
        },
      );

      return parsedResponse.data; // Assuming parsedResponse.data is a CountryDto[]
    } catch (err) {
      console.error('Error fetching packages:', err);
      if (err.response?.status === 422) {
        throw new HttpException(err.response.data, 422);
      }
      throw new InternalServerErrorException();
    }
  }

  async getPlansV2(): Promise<CountryDto[]> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<SynchronizePlansResponseDto>(
          `${this.config.get<string>('AIRALO_URL_SANDBOX')}/v2${AIRALO_ENDPOINTS.PACKAGES}`,
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded',
              Authorization: `Bearer ${this.config.get<string>('AIRALO_TOKEN')}`,
            },
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            console.log(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );
    return data.data;
  }
}
