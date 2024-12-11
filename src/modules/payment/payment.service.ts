import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { calculateDigest } from 'src/common/helpers/digest.helper';
import { IDigest } from 'src/common/interfaces/digest.interface';
import { DatabaseService } from 'src/database/database.service';
import { DigestTransactionDataDto } from './dtos/requests/digest_transaction_data.dto';
import { MonriTransactionDto } from './dtos/requests/transaction.dto';

@Injectable()
export class PaymentService {
  constructor(
    private readonly databaseService: DatabaseService,
    private configService: ConfigService,
  ) {}

  //   private transactionModel = this.databaseService.transaction;

  async initializeTransaction(transactionData: MonriTransactionDto) {
    try {
      const key = this.configService.get('MONRI_KEY');
      console.log('🚀 ~ PaymentService ~ initializeTransaction ~ key:', key);

      const data: IDigest = {
        order_number: transactionData.order_number,
        amount: transactionData.amount.toString(),
        currency: transactionData.currency,
      };
      console.log('🚀 ~ PaymentService ~ initializeTransaction ~ data:', data);
      // 1. Verify the digest
      // const receivedDigest = transactionData.digest;
      // console.log(
      //   '🚀 ~ PaymentService ~ initializeTransaction ~ receivedDigest:',
      //   receivedDigest,
      // );

      // const computedDigest = calculateDigest(key, data);
      // console.log(
      //   '🚀 ~ PaymentService ~ initializeTransaction ~ computedDigest:',
      //   computedDigest,
      // );

      // if (computedDigest !== receivedDigest) {
      //   throw new BadRequestException('Invalid digest');
      // }

      // 2. Process the transaction
      if (transactionData.status === 'approved') {
        // Update the order status in your database
        console.log('Order paid successfully');

        // await this.updateOrderStatus(transactionData.order_number, 'paid');
      } else {
        // Handle declined or failed transactions
        console.log('Transaction failed');
        // await this.updateOrderStatus(transactionData.order_number, 'failed');
      }

      // 3. Send a response to Monri
      return { message: 'Transaction processed successfully' };
    } catch (error) {
      console.error('Error processing Monri callback:', error);
      throw new BadRequestException('Error processing transaction');
    }
  }

  async digest(transactionData: DigestTransactionDataDto) {
    const key = this.configService.get('MONRI_KEY');
    return calculateDigest(key, transactionData);
  }
}
