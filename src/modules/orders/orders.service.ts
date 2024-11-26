import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { AiraloOrdersService } from '../airalo/services/airalo-orders.service';
import { CreateOrderRequestDto } from './dtos/requests/order.request.dto';
import { LoggedUserInfoDto } from '../auth/dtos/logged-user-info.dto';
import { CreateOrderDto } from '../airalo/dtos/requests/create-order.request.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly ordersService: AiraloOrdersService,
  ) {}
  private readonly orderModel = this.databaseService.order;

  async getMyOrders(loggedUser: LoggedUserInfoDto) {
    return this.orderModel.findMany({
      where: {
        userId: loggedUser.id,
      },
    });
  }
  // SuperAdmin
  async getOrders() {
    return this.orderModel.findMany({});
  }

  async create(data: Prisma.OrderCreateInput) {
    return this.databaseService.order.create({
      data,
    });
  }

  async createOrder(
    loggedUser: LoggedUserInfoDto,
    createOrderDto: CreateOrderDto,
  ) {
    // const orders = await this.getMyOrders(loggedUser);

    const airaloOrder = await this.ordersService.createOrder(
      loggedUser,
      createOrderDto,
    );
    console.log(0, airaloOrder);
    console.log('SADSAD', airaloOrder.sims);

    const data: CreateOrderRequestDto = {
      orderId: airaloOrder.id,
      code: airaloOrder.code,
      orderCreatedAt: airaloOrder.created_at,
      quantity: airaloOrder.quantity,
      packageId: airaloOrder.package_id,
      user: {
        connect: {
          id: loggedUser.id,
        },
      },
      esim: {
        createMany: {
          data: airaloOrder.sims.map((sim) => ({
            qrcode: sim.qrcode,
            qrcodeUrl: sim.qrcode_url,
            esimId: sim.id,
            iccid: sim.iccid,
            userId: loggedUser.id,
          })),
        },
      },
    };
    console.log(1, data);

    const order = await this.create(data);

    console.log(2, order);

    return {
      message: 'Order created successfully',
      order,
      airaloOrder,
    };
  }
}
