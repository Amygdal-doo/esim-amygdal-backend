import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { MonriTransactionDto } from './dtos/requests/transaction.dto';
import { plainToInstance } from 'class-transformer';
import { UserLogged } from '../auth/decorators/user.decorator';
import { InitializePaymentDto } from './dtos/requests/initialize-payment.dto';
import { LoggedUserInfoDto } from '../auth/dtos/logged-user-info.dto';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { InitializeTransactionResponseDto } from './dtos/response/initalize-tranasaction.response.dto';

@ApiTags('Payment')
@Controller({ path: 'payment', version: '1' })
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('initialize')
  @ApiOperation({
    summary: 'Payment initialization',
    description: 'Payment initialization',
  })
  @ApiBearerAuth('Access Token')
  @UseFilters(new HttpExceptionFilter())
  @UseGuards(AccessTokenGuard)
  @Serialize(InitializeTransactionResponseDto)
  @ApiOkResponse({ type: InitializeTransactionResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @HttpCode(200)
  async initialize(
    @UserLogged() loggedUserInfoDto: LoggedUserInfoDto,
    @Body() body: InitializePaymentDto,
  ) {
    return this.paymentService.initializeTransaction(loggedUserInfoDto, body);
  }

  @Post('callback')
  @ApiOperation({
    summary: 'Payment callback',
    description: 'Payment callback',
  })
  // @ApiBearerAuth('Access Token')
  @UseFilters(new HttpExceptionFilter())
  // @UseGuards(AccessTokenGuard)
  // @Serialize(InitializeTransactionResponseDto)
  // @ApiOkResponse({ type: InitializeTransactionResponseDto })
  // @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @HttpCode(200)
  async transaction(@Body() body: any) {
    console.log('🚀 ~ PaymentController ~ initializeTransaction ~ body:', body);
    const parsed = JSON.parse(body.transaction_response);
    console.log(
      '🚀 ~ PaymentController ~ initializeTransaction ~ parsed:',
      parsed,
    );
    let parsedResponse: MonriTransactionDto;
    try {
      parsedResponse = plainToInstance(MonriTransactionDto, parsed, {
        enableCircularCheck: true,
      });
      console.log(parsedResponse);
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
    return this.paymentService.proccessTransaction(parsedResponse);
    //   id: 882179,
    //   acquirer: 'xml-sim',
    //   order_number: 'c5g2b4385fadk3494',
    //   amount: 300,
    //   currency: 'USD',
    //   outgoing_amount: 300,
    //   outgoing_currency: 'USD',
    //   approval_code: '419333',
    //   response_code: '0000',
    //   response_message: 'transaction approved',
    //   responseCode: '0000',
    //   responseMessage: 'transaction approved',
    //   reference_number: '904653',
    //   systan: '882179',
    //   eci: '06',
    //   xid: null,
    //   acsv: null,
    //   cc_type: 'visa',
    //   status: 'approved',
    //   created_at: '2024-12-11T11:21:44+01:00',
    //   transaction_type: 'purchase',
    //   enrollment: 'N',
    //   authentication: null,
    //   pan_token: null,
    //   issuer: 'off-us',
    //   ch_full_name: 'Test8',
    //   language: 'en',
    //   masked_pan: '405840-xxx-xxx-0005',
    //   number_of_installments: null,
    //   custom_params: '',
    // };

    // return this.paymentService.initializeTransaction(parsedResponse);
  }
}
