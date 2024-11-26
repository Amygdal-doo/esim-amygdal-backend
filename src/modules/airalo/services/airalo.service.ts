import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { AIRALO_ENDPOINTS } from '../constants/url.constants';
import {
  AiraloTokenDataDto,
  AiraloTokenResponseDto,
} from '../dtos/responses/token-response.dto';
import { AxiosResponse } from 'axios';
import { plainToInstance } from 'class-transformer';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { validate } from 'class-validator';
import { UserAiraloTokenService } from '../../user/services/user-airalo-token.service';
import { LoggedUserInfoDto } from '../../auth/dtos/logged-user-info.dto';
import { decryptToken, encryptToken } from 'src/common/helpers/encrypt.helper';
import { InstallationInstructionsResponseDto } from '../dtos/responses/instructions.response.dto';
import { isTokenExpired } from 'src/common/helpers/expire.helper';

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

  async getInstructions(
    loggedUser: LoggedUserInfoDto,
    sim_iccid: string,
    lang: string,
  ): Promise<InstallationInstructionsResponseDto> {
    const decodedToken = await this.getOrRefreshToken(loggedUser.id);

    try {
      const headers = {
        Accept: 'application/json',
        Authorization: `Bearer ${decodedToken}`,
        'Accept-Language': lang,
      };
      const response = await lastValueFrom(
        this.httpService.get<
          AxiosResponse<InstallationInstructionsResponseDto>
        >(
          `${this.config.get<string>('AIRALO_URL_SANDBOX')}/v2/sims/${sim_iccid}${AIRALO_ENDPOINTS.INSTRUCTIONS}`,
          {
            headers,
          },
        ),
      );

      const parsedResponse = plainToInstance(
        InstallationInstructionsResponseDto,
        response.data,
        {
          enableCircularCheck: true,
        },
      );
      console.log(parsedResponse);

      return parsedResponse;
    } catch (err) {
      console.error('Error fetching token:', err.response.data.meta.message);
      if (err.response?.status === 422) {
        throw new HttpException(err.response.data, 422);
      }
      if (err.response?.status === 404) {
        throw new HttpException(err.response.data, 404);
      }

      if (err.response?.status === 401) {
        throw new HttpException(err.response.data, 401);
      }
      throw new InternalServerErrorException();
      // throw new HttpException(err.response.data, err.response.status);
    }
  }

  async getOrRefreshToken(userId: string): Promise<string> {
    let airalo = await this.airaloTokenService.findOne(userId);

    if (!airalo) {
      const newToken = await this.getToken();
      await this.airaloTokenService.create(
        userId,
        encryptToken(newToken.access_token),
        newToken.expires_in,
      );
      airalo = await this.airaloTokenService.findOne(userId);
    } else {
      const isTokenExp = isTokenExpired(airalo.createdAt, airalo.expiresIn);
      if (isTokenExp) {
        const newToken = await this.getToken();
        await this.airaloTokenService.update(
          userId,
          encryptToken(newToken.access_token),
          newToken.expires_in,
        );
        airalo = await this.airaloTokenService.findOne(userId);
      }
    }

    return decryptToken(airalo.token);
  }
}
