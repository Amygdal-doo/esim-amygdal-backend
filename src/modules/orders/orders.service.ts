import { Injectable, NotFoundException } from '@nestjs/common';
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
    console.log(loggedUser);

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
    const airalo = await this.ordersService.getOrder(
      loggedUser,
      { include: 'sims,status' },
      order.orderId,
    );
    return {
      order,
      airalo,
    };
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

    const airaloOrder = await this.ordersService.create(
      loggedUser,
      createOrderDto,
    );

    const data: CreateOrderRequestDto = {
      orderId: airaloOrder.id,
      code: airaloOrder.code,
      orderCreatedAt: airaloOrder.created_at,
      quantity: airaloOrder.quantity.toString(),
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

    const order = await this.create(data);

    return {
      message: 'Order created successfully',
      order,
      airaloOrder,
    };
  }
}
