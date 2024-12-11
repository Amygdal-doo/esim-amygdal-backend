import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { DigestTransactionDataDto } from './dtos/requests/digest_transaction_data.dto';
import {
  MonriTransactionDto,
  TransactionDto,
} from './dtos/requests/transaction.dto';
import { plainToInstance } from 'class-transformer';

@ApiTags('Payment')
@Controller({ path: 'payment', version: '1' })
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('digest')
  async digest(@Body() body: DigestTransactionDataDto) {
    return this.paymentService.digest(body);
  }

  @Post('callback')
  async initializeTransaction(@Body() body: any) {
    console.log('🚀 ~ PaymentController ~ initializeTransaction ~ body:', body);
    const parsed = JSON.parse(body.transaction_response);
    console.log(
      '🚀 ~ PaymentController ~ initializeTransaction ~ parsed:',
      parsed,
    );

    const parsedResponse = plainToInstance(MonriTransactionDto, parsed, {
      enableCircularCheck: true,
    });
    console.log(parsedResponse);

    const a = parsedResponse.currency;
    console.log(a);

    const testData = {
      id: 882179,
      acquirer: 'xml-sim',
      order_number: 'c5g2b4385fadk3494',
      amount: 300,
      currency: 'USD',
      outgoing_amount: 300,
      outgoing_currency: 'USD',
      approval_code: '419333',
      response_code: '0000',
      response_message: 'transaction approved',
      responseCode: '0000',
      responseMessage: 'transaction approved',
      reference_number: '904653',
      systan: '882179',
      eci: '06',
      xid: null,
      acsv: null,
      cc_type: 'visa',
      status: 'approved',
      created_at: '2024-12-11T11:21:44+01:00',
      transaction_type: 'purchase',
      enrollment: 'N',
      authentication: null,
      pan_token: null,
      issuer: 'off-us',
      ch_full_name: 'Test8',
      language: 'en',
      masked_pan: '405840-xxx-xxx-0005',
      number_of_installments: null,
      custom_params: '',
    };

    // return this.paymentService.initializeTransaction(parsedResponse);
  }
}
