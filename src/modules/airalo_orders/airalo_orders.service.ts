import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderStatus, Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { AiraloOrdersApiService } from '../airalo/services/airalo-orders.service';
import { LoggedUserInfoDto } from '../auth/dtos/logged-user-info.dto';
import {
  ICreateOrder,
  ISubmitOrder,
} from '../airalo/interfaces/submit-order.interface';

@Injectable()
export class AiraloOrdersService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly airaloOrdersApiService: AiraloOrdersApiService,
  ) {}
  private readonly orderModel = this.databaseService.airaloOrder;

  async getMyOrders(loggedUser: LoggedUserInfoDto) {
    return this.orderModel.findMany({
      where: {
        userId: loggedUser.id,
      },
      include: {
        esim: true,
      },
    });
  }
  // SuperAdmin
  async getOrders() {
    return this.orderModel.findMany({});
  }

  async findById(id: string) {
    return this.orderModel.findUnique({
      where: { id },
    });
  }

  async getOrder(loggedUser: LoggedUserInfoDto, orderId: string) {
    const order = await this.findById(orderId);
    if (order.userId !== loggedUser.id) {
      throw new NotFoundException('Order not found');
    }
    const airalo = await this.airaloOrdersApiService.getOrder(
      loggedUser,
      { include: 'sims,status' },
      order.orderId,
    );
    return {
      order,
      airalo,
    };
  }

  async create(data: Prisma.AiraloOrderCreateInput) {
    return this.orderModel.create({
      data,
    });
  }

  async update(id: string, data: Prisma.AiraloOrderUpdateInput) {
    return this.orderModel.update({
      where: { id },
      data,
    });
  }

  async createOrder(createOrder: ICreateOrder, airaloOrderId: string) {
    // const orders = await this.getMyOrders(loggedUser);
    const { userId, transactionId, ...rest } = createOrder;

    const submitOrder: ISubmitOrder = {
      ...rest,
    };
    const airaloOrder = await this.airaloOrdersApiService.create(
      userId,
      submitOrder,
    );

    if (airaloOrder.status === 422 || airaloOrder.status === 500) {
      console.log(airaloOrder.error, airaloOrder.message);
      // update airaloOrder status

      throw new Error(airaloOrder.message);
    }

    const data: Prisma.AiraloOrderUpdateInput = {
      orderId: airaloOrder.data.id,
      code: airaloOrder.data.code,
      status: OrderStatus.COMPLETED, // watch out for this ?
      orderCreatedAt: airaloOrder.data.created_at,
      quantity: Number(airaloOrder.data.quantity),
      packageId: airaloOrder.data.package_id,
      // transaction: { connect: { id: transactionId } },
      // user: {
      //   connect: {
      //     id: userId,
      //   },
      // },
      esim: {
        createMany: {
          data: airaloOrder.data.sims.map((sim) => ({
            qrcode: sim.qrcode,
            qrcodeUrl: sim.qrcode_url,
            esimId: sim.id,
            iccid: sim.iccid,
            userId,
          })),
        },
      },
    };

    const order = await this.update(airaloOrderId, data); // await this.create(data);

    return {
      message: 'Order created successfully',
      order,
      airaloOrder,
    };
  }
}
