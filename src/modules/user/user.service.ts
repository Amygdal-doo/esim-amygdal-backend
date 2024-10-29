import { Injectable } from '@nestjs/common';
import { UserNotFoundException } from 'src/common/exceptions/errors/user/user-no-exist.exception';
import { Prisma, Role } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(data: Prisma.UserCreateInput) {
    if (!data.role) data.role = Role.USER;
    return this.databaseService.user.create({ data });
  }

  async findByEmail(email: string) {
    const result = await this.databaseService.user.findUnique({
      where: { email },
    });
    return result;
  }

  async findById(id: string) {
    const result = await this.databaseService.user.findUnique({
      where: { id },
    });
    return result;
  }

  async findByUsername(username: string) {
    const result = await this.databaseService.user.findUnique({
      where: { username },
    });
    return result;
  }

  async findByGoogleId(googleId: string) {
    const result = await this.databaseService.user.findUnique({
      where: { googleId },
    });
    return result;
  }

  async findRefreshToken(userId: string) {
    const result = await this.databaseService.refreshToken.findUnique({
      where: { userId },
    });
    return result;
  }

  async createToken(userId: string, refresTokenStr: string | null) {
    const result = await this.databaseService.refreshToken.create({
      data: {
        userId,
        token: refresTokenStr,
      },
    });
    result;
  }

  async updateToken(userId: string, refresTokenStr: string | null) {
    const result = await this.databaseService.refreshToken.update({
      where: { userId },
      data: {
        userId,
        token: refresTokenStr,
      },
    });
    result;
  }

  async updateRefreshToken(userId: string, refresTokenStr: string | null) {
    const existUser = await this.findById(userId);
    if (!existUser) throw new UserNotFoundException();
    const existingToken = await this.findRefreshToken(userId);
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

  async generateRandomUsername(): Promise<string> {
    const randomString = Math.random().toString(36).substring(2, 8); // Generate a random string
    const randomNumber = Math.floor(1000 + Math.random() * 9000); // Generate a 4-digit random number
    return `user_${randomString}${randomNumber}`; // Example output: user_abcd1234
  }

  async generateUniqueUsername(): Promise<string> {
    let username: string;
    let isUnique = false;

    while (!isUnique) {
      username = await this.generateRandomUsername(); // Call the username generation function

      // Check if the username already exists
      const existingUser = await this.findByUsername(username);
      if (!existingUser) {
        isUnique = true; // Username is unique, break the loop
      }
    }

    return username;
  }

  async getLoggedUser(id: string) {
    const user = await this.findById(id);
    return user;
  }

  // async getUserAndRefreshtokenByUserId(id: string) {
  //   const result = await this.db.query.userTable.findFirst({
  //     where: eq(schema.userTable.id, id),
  //     with: { resfreshToken: true },
  //   });
  //   return result;
  // }

  async updateUserById(id: string, data: Prisma.UserUpdateInput) {
    const result = await this.databaseService.user.update({
      where: { id },
      data,
    });
    return result;
  }
}
