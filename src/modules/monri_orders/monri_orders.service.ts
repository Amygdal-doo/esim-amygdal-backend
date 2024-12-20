import { Injectable } from '@nestjs/common';
import { OrderStatus, Prisma } from '@prisma/client';
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

  // async create(
  //   loggedUser: LoggedUserInfoDto,
  //   initializePaymentDto: InitializePaymentDto,
  // ) {
  //   const { packages,, currency } = initializePaymentDto;
  //   const amount = (packages.price * quantity).toFixed(2);

  //   const data: Prisma.MonriOrderCreateInput = {
  //     user: { connect: { id: loggedUser.id } },
  //     packageId: packages.id,
  //     amount,
  //     status: OrderStatus.PENDING,
  //     transaction: {
  //       create: {
  //         user: { connect: { id: loggedUser.id } },
  //         amount,
  //         status: OrderStatus.PENDING,
  //       },
  //     },
  //     quantity,
  //     currency,
  //     paymentId: null,
  //   };
  //   return this.orderModel.create({ data });
  // }
}
