import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { AiraloEsimsService } from '../airalo/services/airalo-esims.service';
import { LoggedUserInfoDto } from '../auth/dtos/logged-user-info.dto';
import { EsimResponseDto } from './dtos/responses/esim.response.dto';

@Injectable()
export class EsimsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly airaloEsimsService: AiraloEsimsService,
  ) {}

  async createEsim(data: Prisma.EsimCreateInput) {
    return await this.databaseService.esim.create({ data });
  }

  async findIccid(iccid: string, userId: string) {
    return await this.databaseService.esim.findUnique({
      where: { iccid, userId },
    });
  }

  async usage(loggedUserInfoDto: LoggedUserInfoDto, sim_iccid: string) {
    const esim = await this.findIccid(sim_iccid, loggedUserInfoDto.id);
    if (!esim) throw new NotFoundException('Esim not found');

    return await this.airaloEsimsService.getSimStatus(
      loggedUserInfoDto.id,
      sim_iccid,
    );
  }

  async findAll(userId: string): Promise<EsimResponseDto[]> {
    return await this.databaseService.esim.findMany({
      where: { userId },
    });
  }

  async findById(userId: string, id: string): Promise<EsimResponseDto> {
    return await this.databaseService.esim.findUnique({
      where: { id, userId },
    });
  }
}
