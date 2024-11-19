import { Injectable } from '@nestjs/common';
import { UserNotFoundException } from 'src/common/exceptions/errors/user/user-no-exist.exception';
import { DatabaseService } from 'src/database/database.service';
import { UserService } from './user.service';

@Injectable()
export class UserRefreshTokenService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly userService: UserService,
  ) {}

  private refreshTokenModel = this.databaseService.refreshToken;

  async findByUserId(userId: string) {
    const result = await this.refreshTokenModel.findUnique({
      where: { userId },
    });
    return result;
  }

  async createToken(userId: string, refresTokenStr: string | null) {
    const result = await this.refreshTokenModel.create({
      data: {
        userId,
        token: refresTokenStr,
      },
    });
    result;
  }

  async updateToken(userId: string, refresTokenStr: string | null) {
    const result = await this.refreshTokenModel.update({
      where: { userId },
      data: {
        userId,
        token: refresTokenStr,
      },
    });
    result;
  }

  async updateRefreshToken(userId: string, refresTokenStr: string | null) {
    const existUser = await this.userService.findById(userId);
    if (!existUser) throw new UserNotFoundException();
    const existingToken = await this.findByUserId(userId);
    let update;
    if (existingToken) {
      // Update the existing refresh token
      update = await this.updateToken(userId, refresTokenStr);
    } else {
      // Create a new refresh token
      update = await this.createToken(userId, refresTokenStr);
    }

    return update;
  }
}
