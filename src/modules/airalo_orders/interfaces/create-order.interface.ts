import { OrderStatus, Prisma } from '@prisma/client';

export interface ICreateOrder extends Prisma.AiraloOrderCreateInput {
  orderId: number;
  code: string;
  orderCreatedAt: string;
  quantity: number;
  packageId: string;
  esim?: Prisma.EsimCreateNestedManyWithoutOrderInput;
  user: Prisma.UserCreateNestedOneWithoutAiralOrdersInput;
  status: OrderStatus;
  transaction: Prisma.TransactionCreateNestedOneWithoutAiraloOrderInput;
}
