import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { calculateDigest } from 'src/common/helpers/digest.helper';
import { IDigest } from 'src/common/interfaces/digest.interface';
import { DatabaseService } from 'src/database/database.service';
// import { DigestTransactionDataDto } from './dtos/requests/digest_transaction_data.dto';
// import { MonriTransactionDto } from './dtos/requests/transaction.dto';
import { LoggedUserInfoDto } from '../auth/dtos/logged-user-info.dto';
import { MonriOrdersService } from '../monri_orders/monri_orders.service';
import { toCents } from 'src/common/helpers/to-cents.helper';
import { AiraloOrdersService } from '../airalo_orders/airalo_orders.service';
import { UserService } from '../user/services/user.service';
import { CreatePaymentIntentDto } from './dtos/requests/create-payment-intent.dto';
import axios from 'axios';
import { BundleService } from '../bundle/bundle.service';
import { InitializePaymentDto } from './dtos/requests/initialize-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    private readonly databaseService: DatabaseService,
    private configService: ConfigService,
    private readonly monriOrdersService: MonriOrdersService,
    private readonly airaloOrdersService: AiraloOrdersService,
    private readonly userService: UserService,
    private readonly bundleService: BundleService,
  ) {}

  private transactionModel = this.databaseService.walletTransaction;

  // async findById(id: string) {
  //   return this.transactionModel.findUnique({ where: { id } });
  // }

  // async update(id: string, data: Prisma.WalletTransactionUpdateInput) {
  //   return this.transactionModel.update({ where: { id }, data });
  // }

  // async initializeTransaction(
  //   loggedUserInfoDto: LoggedUserInfoDto,
  //   initializePaymentDto: InitializePaymentDto,
  // ): Promise<InitializeTransactionResponseDto> {
  //   const user = await this.userService.findById(loggedUserInfoDto.id);

  //   if (!user) {
  //     throw new ForbiddenException(
  //       'User not found, Cant continue with payment',
  //     );
  //   }

  //   try {
  //     // const { package, quantity, currency } = initializePaymentDto;
  //     const monriOrder = await this.monriOrdersService.create(
  //       loggedUserInfoDto,
  //       initializePaymentDto,
  //     );

  //     const amountInCents = toCents(Number(monriOrder.amount));

  //     const digestData: IDigest = {
  //       order_number: monriOrder.id,
  //       amount: amountInCents,
  //       currency: monriOrder.currency,
  //     };

  //     const digest = this.digest(digestData);

  //     return {
  //       digest,
  //       amount: amountInCents,
  //       currency: monriOrder.currency,
  //       orderNumber: monriOrder.id,
  //     };
  //   } catch (error) {
  //     console.error('Error Initializing Transaction', error);
  //     throw new BadRequestException('Error Initializing transaction');
  //   }
  // }

  // async proccessTransaction(monriTransactionDto: MonriTransactionDto) {
  //   try {
  //     const monriOrder = await this.monriOrdersService.findById(
  //       monriTransactionDto.order_number,
  //     );

  //     if (!monriOrder) {
  //       // update
  //       throw new BadRequestException('Order not found');
  //     }
  //     // DIGEST
  //     const digestDataOriginal: IDigest = {
  //       order_number: monriOrder.id,
  //       amount: toCents(Number(monriOrder.amount)),
  //       currency: monriOrder.currency,
  //     };
  //     const digestDataIncoming: IDigest = {
  //       order_number: monriTransactionDto.order_number,
  //       amount: monriTransactionDto.amount.toString(),
  //       currency: monriTransactionDto.currency,
  //     };
  //     const digestOriginal = this.digest(digestDataOriginal);
  //     const digestIncoming = this.digest(digestDataIncoming);

  //     if (digestOriginal !== digestIncoming) {
  //       throw new BadRequestException('Invalid digest');
  //     }
  //     if (monriTransactionDto.status === 'approved') {
  //       // Update the order status in your database
  //       console.log('Order paid successfully');
  //       const monriOrder = await this.monriOrdersService.findById(
  //         monriTransactionDto.order_number,
  //       );

  //       const monriUpdateData: Prisma.MonriOrderUpdateInput = {
  //         status: OrderStatus.COMPLETED,
  //         paymentId: monriTransactionDto.id,
  //         response: JSON.stringify(monriTransactionDto),
  //         orderCreatedAt: monriTransactionDto.created_at,
  //       };

  //       await this.monriOrdersService.update(monriOrder.id, monriUpdateData);

  //       const airaloOrdersData: Prisma.AiraloOrderCreateInput = {
  //         status: OrderStatus.PENDING,
  //         user: { connect: { id: monriOrder.user.id } },
  //         packageId: monriOrder.packageId,
  //         quantity: monriOrder.quantity,
  //         orderCreatedAt: monriTransactionDto.created_at,
  //         transaction: { connect: { id: monriOrder.transaction.id } },
  //       };

  //       const airaloOrders =
  //         await this.airaloOrdersService.create(airaloOrdersData);

  //       const createOrder: ICreateOrder = {
  //         userId: monriOrder.user.id,
  //         transactionId: monriOrder.transaction.id,
  //         quantity: monriOrder.quantity,
  //         package_id: monriOrder.packageId,
  //         description: `${monriOrder.quantity} ${monriOrder.packageId}`,
  //         type: 'sim',
  //       };

  //       // call api to create airalo order
  //       await this.airaloOrdersService.createOrder(
  //         createOrder,
  //         airaloOrders.id,
  //       );

  //       await this.update(monriOrder.transaction.id, {
  //         status: OrderStatus.COMPLETED,
  //       });

  //       return { message: 'Transaction processed successfully' };
  //     } else if (monriTransactionDto.status === 'declined') {
  //       // Handle declined or failed transactions
  //       const monriOrder = await this.monriOrdersService.findById(
  //         monriTransactionDto.order_number,
  //       );
  //       await this.monriOrdersService.updateOrderStatus(
  //         monriOrder.id,
  //         OrderStatus.FAILED,
  //       );

  //       await this.update(monriOrder.transaction.id, {
  //         status: OrderStatus.FAILED,
  //       });

  //       console.log('Transaction Status Declined');
  //       throw new HttpException(
  //         'Transaction Declined',
  //         HttpStatus.PAYMENT_REQUIRED,
  //       );
  //     } else {
  //       const monriOrder = await this.monriOrdersService.findById(
  //         monriTransactionDto.order_number,
  //       );

  //       await this.monriOrdersService.updateOrderStatus(
  //         monriOrder.id,
  //         OrderStatus.FAILED,
  //       );

  //       await this.update(monriOrder.transaction.id, {
  //         status: OrderStatus.FAILED,
  //       });

  //       console.log('Transaction Status Invalid');
  //       throw new HttpException(
  //         'Transaction Invalid',
  //         HttpStatus.PAYMENT_REQUIRED,
  //       );
  //     }
  //   } catch (error) {
  //     console.error('Error processing Monri callback:', error);
  //     throw new BadRequestException('Error processing transaction');
  //   }
  // }

  digest(transactionData: IDigest) {
    return calculateDigest(transactionData);
  }

  async paymentIntent(
    loggedUserInfoDto: LoggedUserInfoDto,
    body: CreatePaymentIntentDto,
  ) {
    console.log('🚀 ~ PaymentService ~ paymentIntent ~ body:', body);
    const fullpath = '/v2/payment/new';
    const monriUrl = `${this.configService.get('MONRI_URL')}${fullpath}`;
    const authenticityToken = this.configService.get(
      'MONRI_AUTHENTICITY_TOKEN',
    ); // Replace with your Monri authenticity token
    const merchantKey = this.configService.get('MONRI_KEY'); // Replace with your Monri merchant key
    const url = this.configService.get('FRONTEND_URL'); //this.configService.get('FRONTEND_URL');
    const timestamp = Math.floor(Date.now() / 1000).toString();

    console.log({
      fullpath,
      monriUrl,
      authenticityToken,
      merchantKey,
      url,
      timestamp,
    });

    const creditBundle = await this.bundleService.findById(body.bundleId);

    console.log(
      '🚀 ~ PaymentService ~ paymentIntent ~ creditBundle:',
      creditBundle,
    );

    if (!creditBundle) throw new BadRequestException('Credit bundle not found');

    const amountInCents = toCents(Number(creditBundle.price));
    console.log({ amountInCents });

    const data = {
      transaction: {
        amount: amountInCents, // Amount in the smallest currency unit (e.g., cents)
        currency: creditBundle.currency,
        order_info: creditBundle.title,
      },
      success_url: `${url}/api/v1/payment/success`,
      cancel_url: `${url}/api/v1/payment/cancel`,
    };
    console.log(111, data);

    const bodyString = JSON.stringify(data);
    console.log('🚀 ~ PaymentService ~ bodyString:', bodyString);

    const initializePaymentDto: InitializePaymentDto = {
      price: amountInCents,
      currency: creditBundle.currency,
    };
    console.log(
      '🚀 ~ PaymentService ~ initializePaymentDto:',
      initializePaymentDto,
    );

    const monriOrder = await this.monriOrdersService.create(
      loggedUserInfoDto,
      initializePaymentDto,
    );
    console.log('🚀 ~ PaymentService ~ monriOrder:', monriOrder);

    const digestData: IDigest = {
      order_number: monriOrder.id,
      amount: amountInCents,
      currency: monriOrder.currency,
      fullpath: fullpath,
      body: bodyString,
      merchant_key: merchantKey,
      timestamp: timestamp,
    };
    console.log('🚀 ~ PaymentService ~ digestData:', digestData);

    const digest = this.digest(digestData);
    console.log('🚀 ~ PaymentService ~ digest:', digest);
    const authorizationHeader = `WP3-v2.1 ${authenticityToken} ${timestamp} ${digest}`;

    console.log(
      '🚀 ~ PaymentService ~ authorizationHeader:',
      authorizationHeader,
    );
    const headers = {
      Authorization: authorizationHeader,
      'Content-Type': 'application/json',
    };
    console.log(222, headers);

    try {
      const response = await axios.post(monriUrl, data, { headers });
      console.log(333, response.data);

      return { clientSecret: response.data.client_secret };
    } catch (error) {
      console.log(error);

      console.log(error.response?.data);

      throw new Error(
        `Failed to create payment intent: ${error.response?.data?.message || error.message}`,
      );
    }
  }

  async paymentSuccess(body: any) {
    console.log('🚀 ~ PaymentService ~ paymentIntent ~ body:', body);
    return { message: 'Payment successful' };
  }

  async paymentCancel(body: any) {
    console.log('🚀 ~ PaymentService ~ paymentIntent ~ body:', body);
    return { message: 'Payment Canceled' };
  }
}
