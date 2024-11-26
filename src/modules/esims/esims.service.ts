import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class EsimsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createEsim(data: Prisma.EsimCreateInput) {
    return await this.databaseService.esim.create({ data });
  }
}
