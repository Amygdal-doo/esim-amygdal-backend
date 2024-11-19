import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, lastValueFrom } from 'rxjs';
import { AIRALO_ENDPOINTS } from './constants/url.constants';
import {
  AiraloTokenDataDto,
  AiraloTokenResponseDto,
} from './dtos/responses/token-response.dto';
import { AxiosError, AxiosResponse } from 'axios';
import { plainToInstance } from 'class-transformer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  CountryDto,
  SynchronizePlansResponseDto,
} from './dtos/responses/synchronize_plans.response.dto';
import { validate } from 'class-validator';
import { UserAiraloTokenService } from '../user/services/user-airalo-token.service';
import { LoggedUserInfoDto } from '../auth/dtos/logged-user-info.dto';
import { GetPackagesDto } from './dtos/requests/packages.request.dto';
import { decryptToken, encryptToken } from 'src/common/helpers/encrypt.helper';

ConfigModule.forRoot();

@Injectable()
export class AiraloService {
  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
    private readonly airaloTokenService: UserAiraloTokenService,
  ) {}

  // async getToken(): Promise<AiraloTokenResponseDto> {
  //   const formData = new URLSearchParams();
  //   formData.append(
  //     'client_id',
  //     `${this.config.get<string>('AIRALO_CLIENT_ID')}`,
  //   );
  //   formData.append(
  //     'client_secret',
  //     `${this.config.get<string>('AIRALO_CLIENT_SECRET')}`,
  //   );
  //   formData.append('grant_type', 'client_credentials');

  //   const response = await lastValueFrom(
  //     this.httpService.post<AxiosResponse<AiraloTokenResponseDto>>(
  //       `${this.config.get<string>('AIRALO_URL_SANDBOX')}/v2${AIRALO_ENDPOINTS.TOKEN}`,
  //       formData,
  //       {
  //         headers: {
  //           Accept: 'application/json',
  //           'Content-Type': 'application/x-www-form-urlencoded',
  //         },
  //       },
  //     ),
  //   ).catch((err) => {
  //     console.error('Error fetching token:', err.response.data);
  //     if (err.response.status === 422) {
  //       throw new HttpException(err.response.data, 422);
  //     }
  //     throw new InternalServerErrorException();
  //   });
  //   // console.log(111, { response: response.data });

  //   // const parsedResponse = plainToInstance(AiraloTokenResponseDto, response, {
  //   //   enableCircularCheck: true,
  //   // });

  //   return response.data;
  // }

  async getToken(): Promise<AiraloTokenDataDto> {
    const formData = new URLSearchParams();
    formData.append('client_id', this.config.get<string>('AIRALO_CLIENT_ID'));
    formData.append(
      'client_secret',
      this.config.get<string>('AIRALO_CLIENT_SECRET'),
    );
    formData.append('grant_type', 'client_credentials');

    const response = await lastValueFrom(
      this.httpService.post<AxiosResponse<AiraloTokenResponseDto>>(
        `${this.config.get<string>('AIRALO_URL_SANDBOX')}/v2${AIRALO_ENDPOINTS.TOKEN}`,
        formData,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      ),
    ).catch((err) => {
      console.error('Error fetching token:', err.response?.data || err.message);
      if (err.response?.status === 422) {
        throw new HttpException(err.response.data, 422);
      }
      throw new InternalServerErrorException('Failed to fetch token');
    });

    const parsedResponse = plainToInstance(
      AiraloTokenResponseDto,
      response.data,
      {
        enableCircularCheck: true,
      },
    );

    const errors = await validate(parsedResponse);
    if (errors.length > 0) {
      console.error('Validation errors:', errors);
      throw new InternalServerErrorException('Invalid token response format');
    }

    return parsedResponse.data;
  }

  // async getPlans(
  //   loggedUser: LoggedUserInfoDto,
  //   query: GetPackagesDto,
  // ): Promise<CountryDto[]> {
  //   let airalo = await this.airaloTokenService.findOne(loggedUser.id);

  //   if (!airalo) {
  //     const newToken = await this.getToken();
  //     airalo = await this.airaloTokenService.create(
  //       loggedUser.id,
  //       newToken.access_token,
  //       newToken.expires_in,
  //     );
  //     airalo = await this.airaloTokenService.findOne(loggedUser.id);
  //   }
  //   const decodedToken = decryptToken(airalo.token);
  //   try {
  //     const response = await lastValueFrom(
  //       this.httpService.get<AxiosResponse<SynchronizePlansResponseDto>>(
  //         `${this.config.get<string>('AIRALO_URL_SANDBOX')}/v2${AIRALO_ENDPOINTS.PACKAGES}`,
  //         {
  //           headers: {
  //             Accept: 'application/json',
  //             'Content-Type': 'application/x-www-form-urlencoded',
  //             Authorization: `Bearer ${decodedToken}`,
  //           },
  //         },
  //       ),
  //     );

  //     const parsedResponse = plainToInstance(
  //       SynchronizePlansResponseDto,
  //       response.data, // Ensure you use response.data here
  //       {
  //         enableCircularCheck: true,
  //       },
  //     );
  //     console.log(parsedResponse.data);

  //     return parsedResponse.data; // Assuming parsedResponse.data is a CountryDto[]
  //   } catch (err) {
  //     console.error('Error fetching token:', err);
  //     if (err.response?.status === 422) {
  //       throw new HttpException(err.response.data, 422);
  //     }
  //     throw new InternalServerErrorException();
  //   }
  // }

  async getPackages(
    loggedUser: LoggedUserInfoDto,
    query: GetPackagesDto,
  ): Promise<CountryDto[]> {
    let airalo = await this.airaloTokenService.findOne(loggedUser.id);

    if (!airalo) {
      const newToken = await this.getToken();

      await this.airaloTokenService.create(
        loggedUser.id,
        encryptToken(newToken.access_token),
        newToken.expires_in,
      );
      airalo = await this.airaloTokenService.findOne(loggedUser.id);
    }

    const decodedToken = decryptToken(airalo.token);

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
      console.error('Error fetching token:', err);
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

  // async getPlans(): Promise<CountryDto> {
  //   const response = await lastValueFrom(
  //     this.httpService.get<AxiosResponse<SynchronizePlansResponseDto>>(
  //       `${this.config.get<string>('AIRALO_URL_SANDBOX')}/v2${AIRALO_ENDPOINTS.PACKAGES}`,
  //       {
  //         headers: {
  //           Accept: 'application/json',
  //           'Content-Type': 'application/x-www-form-urlencoded',
  //           Authorization: `Bearer ${this.config.get<string>('AIRALO_TOKEN')}`,
  //         },
  //       },
  //     ),
  //   ).catch((err) => {
  //     console.error('Error fetching token:', err.response.data);
  //     if (err.response.status === 422) {
  //       throw new HttpException(err.response.data, 422);
  //     }
  //     throw new InternalServerErrorException();
  //   });

  //   const parsedResponse = plainToInstance(
  //     SynchronizePlansResponseDto,
  //     response,
  //     {
  //       enableCircularCheck: true,
  //     },
  //   );

  //   return parsedResponse.data;
  // }
}
