import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UserService } from './user.service';

@Injectable()
export class UserAiraloTokenService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly userService: UserService,
  ) {}

  private airaloTokenModel = this.databaseService.airaloToken;

  async findOne(userId: string) {
    const result = await this.airaloTokenModel.findUnique({
      where: { userId },
    });
    return result;
  }

  async create(
    userId: string,
    refresTokenStr: string | null,
    expiresIn: number,
  ) {
    const result = await this.airaloTokenModel.create({
      data: {
        user: { connect: { id: userId } },
        token: refresTokenStr,
        expiresIn,
      },
    });

    return result;
  }

  async update(
    userId: string,
    refresTokenStr: string | null,
    expiresIn: number,
  ) {
    const result = await this.airaloTokenModel.update({
      where: { userId },
      data: {
        token: refresTokenStr,
        expiresIn,
      },
    });
    result;
  }

  //   async saveToken(userId: string) {
  //     const existUser = await this.userService.findById(userId);
  //     if (!existUser) throw new UserNotFoundException();
  //     const existingToken = await this.findOne(userId);
  //     let update;
  //     if (existingToken) {
  //       // Update the existing refresh token
  //       update = await this.update(userId);
  //     } else {
  //       // Create a new refresh token
  //       update = await this.create(userId);
  //     }

  //     return update;
  //   }
}
