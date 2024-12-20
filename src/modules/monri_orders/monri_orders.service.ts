import { Injectable } from '@nestjs/common';
import { OrderStatus, Prisma, WalletTransactionType } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { LoggedUserInfoDto } from '../auth/dtos/logged-user-info.dto';
import { InitializePaymentDto } from '../payment/dtos/requests/initialize-payment.dto';

@Injectable()
export class MonriOrdersService {
  constructor(private readonly databaseService: DatabaseService) {}

  private readonly orderModel = this.databaseService.monriOrder;

  async findById(id: string) {
    const order = await this.orderModel.findUnique({
      where: { id },
      include: { user: true, transaction: true },
    });
    return order;
  }

  async updateOrderStatus(id: string, status: OrderStatus) {
    return this.orderModel.update({
      where: { id },
      data: { status },
    });
  }

  async update(id: string, data: Prisma.MonriOrderUpdateInput) {
    return this.orderModel.update({
      where: { id },
      data,
    });
  }

  async create(
    loggedUser: LoggedUserInfoDto,
    initializePaymentDto: InitializePaymentDto,
  ) {
    const { price, currency } = initializePaymentDto;

    const data: Prisma.MonriOrderCreateInput = {
      user: { connect: { id: loggedUser.id } },
      // packageId: packages.id,
      amount: price,
      status: OrderStatus.PENDING,
      transaction: {
        create: {
          user: { connect: { id: loggedUser.id } },
          amount: price,
          status: OrderStatus.PENDING,
          type: WalletTransactionType.CREDIT_PURCHASE,
        },
      },
      currency,
      paymentId: null,
    };
    return this.orderModel.create({ data });
  }
}
