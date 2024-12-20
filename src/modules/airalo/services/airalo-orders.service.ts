import { HttpService } from '@nestjs/axios';
import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggedUserInfoDto } from 'src/modules/auth/dtos/logged-user-info.dto';
import { UserAiraloTokenService } from 'src/modules/user/services/user-airalo-token.service';
import { AiraloService } from './airalo.service';
import { OrderListResponseDto } from '../dtos/responses/order.response';
import {
  OrderListQueryDto,
  OrderQueryDto,
} from '../dtos/requests/orders-list.request.dto';
import { lastValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { plainToInstance } from 'class-transformer';
import { AIRALO_ENDPOINTS } from '../constants/url.constants';
import { CreateOrderDto } from '../dtos/requests/create-order.request.dto';
import { CreateOrderResponseDto } from '../dtos/responses/create-order.response.dto';
import { SubmitOrderResponseDto } from '../dtos/responses/submit-order.respomse';
import { ISubmitOrder } from '../interfaces/submit-order.interface';

@Injectable()
export class AiraloOrdersApiService {
  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
    private readonly airaloTokenService: UserAiraloTokenService,
    private readonly airaloService: AiraloService,
  ) {}

  async getOrders(
    loggedUser: LoggedUserInfoDto,
    orderQueryDto: OrderListQueryDto,
  ): Promise<OrderListResponseDto> {
    const decodedToken = await this.airaloService.getOrRefreshToken(
      loggedUser.id,
    );

    try {
      // Construct query parameters
      const queryParams = {
        ...(orderQueryDto.filterCreatedAt && {
          'filter[created_at]': orderQueryDto.filterCreatedAt,
        }),
        ...(orderQueryDto.filterIccid && {
          'filter[iccid]': orderQueryDto.filterIccid,
        }),
        ...(orderQueryDto.filterCode && {
          'filter[code]': orderQueryDto.filterCode,
        }),
        ...(orderQueryDto.filterOrderStatus && {
          'filter[status]': orderQueryDto.filterOrderStatus,
        }),
        ...(orderQueryDto.filterDescription && {
          'filter[description]': orderQueryDto.filterDescription,
        }),
        ...(orderQueryDto.limit && { limit: orderQueryDto.limit }),
        ...(orderQueryDto.page && { page: orderQueryDto.page }),
        ...(orderQueryDto.include && { include: orderQueryDto.include }),
      };

      const response = await lastValueFrom(
        this.httpService.get<AxiosResponse<OrderListResponseDto>>(
          `${this.config.get<string>('AIRALO_URL_SANDBOX')}/v2${AIRALO_ENDPOINTS.ORDERS}`,
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
        OrderListResponseDto,
        response.data,
        {
          enableCircularCheck: true,
        },
      );

      return parsedResponse; // Assuming parsedResponse.data is a CountryDto[]
    } catch (err) {
      console.error('Error fetching orders:', err);
      if (err.response?.status === 422) {
        throw new HttpException(err.response.data, 422);
      }
      throw new InternalServerErrorException();
    }
  }

  async getOrder(
    loggedUser: LoggedUserInfoDto,
    orderQueryDto: OrderQueryDto,
    orderId: number,
  ): Promise<OrderListResponseDto> {
    const decodedToken = await this.airaloService.getOrRefreshToken(
      loggedUser.id,
    );

    try {
      // Construct query parameters
      const queryParams = {
        ...(orderQueryDto.include && { include: orderQueryDto.include }),
      };

      const response = await lastValueFrom(
        this.httpService.get<AxiosResponse<OrderListResponseDto>>(
          `${this.config.get<string>('AIRALO_URL_SANDBOX')}/v2${AIRALO_ENDPOINTS.ORDERS}/${orderId}`,
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
        OrderListResponseDto,
        response.data,
        {
          enableCircularCheck: true,
        },
      );

      return parsedResponse; // Assuming parsedResponse.data is a CountryDto[]
    } catch (err) {
      console.error('Error fetching order:', err);
      if (err.response?.status === 422) {
        throw new HttpException(err.response.data, 422);
      }
      throw new InternalServerErrorException();
    }
  }

  // async create(loggedUser: LoggedUserInfoDto, createOrderDto: CreateOrderDto) {}
  async create(
    userId: string,
    createOrderDto: ISubmitOrder,
  ): Promise<SubmitOrderResponseDto> {
    const decodedToken = await this.airaloService.getOrRefreshToken(userId);

    try {
      // Prepare form-data body
      const formData = new URLSearchParams();
      formData.append('quantity', createOrderDto.quantity.toString());
      formData.append('package_id', createOrderDto.package_id);
      if (createOrderDto.type) formData.append('type', createOrderDto.type);
      if (createOrderDto.description)
        formData.append('description', createOrderDto.description);
      if (createOrderDto.brand_settings_name)
        formData.append(
          'brand_settings_name',
          createOrderDto.brand_settings_name,
        );
      if (createOrderDto.to_email)
        formData.append('to_email', createOrderDto.to_email);
      if (createOrderDto.sharing_option) {
        createOrderDto.sharing_option.forEach((option) =>
          formData.append('sharing_option[]', option),
        );
        formData.append(
          'brand_settings_name',
          createOrderDto.brand_settings_name,
        );
      }
      if (createOrderDto.copy_address) {
        createOrderDto.copy_address.forEach((email) =>
          formData.append('copy_address[]', email),
        );
      }

      const response = await lastValueFrom(
        this.httpService.post<CreateOrderResponseDto>(
          `${this.config.get<string>('AIRALO_URL_SANDBOX')}/v2${AIRALO_ENDPOINTS.ORDERS}`,
          formData.toString(), // Body
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded',
              Authorization: `Bearer ${decodedToken}`,
            },
            // Send POST request to create the order
          },
        ),
      );

      // const parsedResponse = plainToInstance(
      //   CreateOrderResponseDto,
      //   response.data,
      //   {
      //     enableCircularCheck: true,
      //   },
      // );

      // console.log(2132, response.data);

      return {
        status: 200,
        message: 'success',
        data: response.data.data,
      };
      // Return the data from the response
    } catch (err) {
      console.error('Error creating order:', err.response);
      if (err.response?.status === 422) {
        return {
          status: 422,
          message: err.response.data.message,
          error: err.response.data,
        };
        // throw new HttpException(err.response.data, 422);
      }
      return {
        status: 500,
        message: err.response.data.message,
        error: err.response.data,
      };
      // throw new InternalServerErrorException();
    }
  }

  // Handle validation error
  async createOrder(
    loggedUser: LoggedUserInfoDto,
    createOrderDto: CreateOrderDto,
  ) {
    return this.create(loggedUser.id, createOrderDto);
  }
  // Handle server error
}
