import { HttpService } from '@nestjs/axios';
import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { plainToInstance } from 'class-transformer';
import { lastValueFrom } from 'rxjs';
import { LoggedUserInfoDto } from 'src/modules/auth/dtos/logged-user-info.dto';
import { UserAiraloTokenService } from 'src/modules/user/services/user-airalo-token.service';
import { AIRALO_ENDPOINTS } from '../constants/url.constants';
import {
  GetSimsListDto,
  GetSimsDto,
} from '../dtos/requests/sims-list.request.dto';
import {
  SimsListResponseDto,
  SimsResponseDto,
} from '../dtos/responses/sims.response.dto';
import { AiraloService } from './airalo.service';
import { InstallationInstructionsResponseDto } from '../dtos/responses/instructions.response.dto';

@Injectable()
export class AiraloEsimsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
    private readonly airaloTokenService: UserAiraloTokenService,
    private readonly airaloService: AiraloService,
  ) {}

  async simsList(
    loggedUser: LoggedUserInfoDto,
    getSimsListDto: GetSimsListDto,
  ): Promise<SimsListResponseDto> {
    const decodedToken = await this.airaloService.getOrRefreshToken(
      loggedUser.id,
    );

    try {
      // Construct query parameters
      const queryParams = {
        ...(getSimsListDto.filterCreatedAt && {
          'filter[created_at]': getSimsListDto.filterCreatedAt,
        }),
        ...(getSimsListDto.filterIccid && {
          'filter[iccid]': getSimsListDto.filterIccid,
        }),
        ...(getSimsListDto.limit && { limit: getSimsListDto.limit }),
        ...(getSimsListDto.page && { page: getSimsListDto.page }),
        ...(getSimsListDto.include && { include: getSimsListDto.include }),
      };

      const response = await lastValueFrom(
        this.httpService.get<AxiosResponse<SimsListResponseDto>>(
          `${this.config.get<string>('AIRALO_URL_SANDBOX')}/v2${AIRALO_ENDPOINTS.SIMS}`,
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
        SimsListResponseDto,
        response.data,
        {
          enableCircularCheck: true,
        },
      );

      return parsedResponse; // Assuming parsedResponse.data is a CountryDto[]
    } catch (err) {
      console.error('Error fetching esim list:', err);
      if (err.response?.status === 422) {
        throw new HttpException(err.response.data, 422);
      }
      throw new InternalServerErrorException();
    }
  }

  async simsByIccid(
    loggedUser: LoggedUserInfoDto,
    sim_iccid: string,
    getSimsDto: GetSimsDto,
  ): Promise<SimsResponseDto> {
    const decodedToken = await this.airaloService.getOrRefreshToken(
      loggedUser.id,
    );

    try {
      // Construct query parameters
      const queryParams = {
        ...(getSimsDto.include && { include: getSimsDto.include }),
      };

      const response = await lastValueFrom(
        this.httpService.get<AxiosResponse<SimsResponseDto>>(
          `${this.config.get<string>('AIRALO_URL_SANDBOX')}/v2${AIRALO_ENDPOINTS.SIMS}/${sim_iccid}`,
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

      const parsedResponse = plainToInstance(SimsResponseDto, response.data, {
        enableCircularCheck: true,
      });

      return parsedResponse; // Assuming parsedResponse.data is a CountryDto[]
    } catch (err) {
      console.error('Error fetching esim:', err?.response);
      if (err.response?.status === 422) {
        throw new HttpException(err.response.data, 422);
      }
      throw new InternalServerErrorException();
    }
  }

  async getInstructions(
    loggedUser: LoggedUserInfoDto,
    sim_iccid: string,
    lang: string,
  ): Promise<InstallationInstructionsResponseDto> {
    const decodedToken = await this.airaloService.getOrRefreshToken(
      loggedUser.id,
    );

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
      // console.log(parsedResponse);

      return parsedResponse;
    } catch (err) {
      console.error(
        'Error fetching instructions:',
        err.response.data.meta.message,
      );
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
}
