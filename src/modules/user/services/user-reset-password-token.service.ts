import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
// import { UserService } from './user.service';
import { IResetPasswordToken } from 'src/modules/auth/interfaces/reset-password-token.interface';

@Injectable()
export class UserResetPasswordTokenService {
  constructor(
    private readonly databaseService: DatabaseService,
    // private readonly userService: UserService,
  ) {}

  private resetPasswordTokenModel = this.databaseService.resetPasswordToken;

  async create(id: string, data: IResetPasswordToken) {
    return this.databaseService.user.update({
      where: { id },
      data: {
        resetPasswordToken: {
          create: {
            ...data,
          },
        },
      },
    });
  }

  async update(id: string, data: IResetPasswordToken) {
    return this.databaseService.user.update({
      where: { id },
      data: {
        resetPasswordToken: {
          update: {
            ...data,
          },
        },
      },
    });
  }

  async getuniqueToken(tokenHash: string) {
    return this.resetPasswordTokenModel.findUnique({
      where: { tokenHash },
      include: { user: true },
    });
  }

  async deleteById(id: string) {
    await this.resetPasswordTokenModel.delete({
      where: { id },
    });
  }
}
