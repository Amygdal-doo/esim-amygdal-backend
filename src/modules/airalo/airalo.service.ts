import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { AIRALO_ENDPOINTS } from './constants/url.constants';
import {
  AiraloTokenDataDto,
  AiraloTokenResponseDto,
} from './dtos/responses/token-response.dto';
import { AxiosResponse } from 'axios';
import { plainToInstance } from 'class-transformer';
import { ConfigModule, ConfigService } from '@nestjs/config';

ConfigModule.forRoot();

@Injectable()
export class AiraloService {
  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) {}

  async getToken(): Promise<AiraloTokenDataDto> {
    const formData = new URLSearchParams();
    formData.append(
      'client_id',
      `${this.config.get<string>('AIRALO_CLIENT_ID')}`,
    );
    formData.append(
      'client_secret',
      `${this.config.get<string>('AIRALO_CLIENT_SECRET')}`,
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
      console.error('Error fetching token:', err.response.data);
      if (err.response.status === 422) {
        throw new HttpException(err.response.data, 422);
      }
      throw new InternalServerErrorException();
    });
    // console.log(response);

    const parsedResponse = plainToInstance(AiraloTokenResponseDto, response, {
      enableCircularCheck: true,
    });
    // console.log(
    //   '🚀 ~ AiraloService ~ getToken ~ parsedResponse:',
    //   parsedResponse,
    // );

    return parsedResponse.data;
  }
}
