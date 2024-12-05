import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UpdateUserProfileDto } from '../dtos/requests/update-user-profile.dto';
import { Profile } from '@prisma/client';

@Injectable()
export class UserProfileService {
  constructor(
    private readonly databaseService: DatabaseService,
    // private readonly userService: UserService,
  ) {}

  private profileModel = this.databaseService.profile;

  async findByUserId(userId: string): Promise<Profile> {
    const result = await this.profileModel.findUnique({
      where: {
        userId,
      },
      include: {
        user: true,
      },
    });

    return result;
  }

  async update(userId: string, data: UpdateUserProfileDto): Promise<Profile> {
    const result = await this.profileModel.update({
      where: {
        userId,
      },
      data,
    });
    return result;
  }

  async create(userId: string, data: UpdateUserProfileDto): Promise<Profile> {
    const result = await this.profileModel.create({
      data: {
        ...data,
        userId,
      },
    });
    return result;
  }

  async updateOrCreate(userId: string, data: UpdateUserProfileDto) {
    const update = await this.profileModel.upsert({
      where: {
        userId,
      },
      update: data,
      create: {
        ...data,
        userId,
      },
    });
    const result = await this.profileModel.findUnique({
      where: {
        id: update.id,
      },
      include: {
        user: true,
      },
    });
    return result;
  }
}
