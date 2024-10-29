import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  logger = new Logger('Database');
  async onModuleInit() {
    await this.$connect()
      .then(() =>
        this.logger.log(
          'DatabaseService status: Connected to postgresql DB...',
        ),
      )
      .catch((err) =>
        this.logger.error('DatabaseService status: ERROR - ' + err),
      );
  }
}
