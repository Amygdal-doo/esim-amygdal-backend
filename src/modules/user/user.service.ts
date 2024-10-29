import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE_CLIENT } from 'src/db/constants/drizzle-client.constant';
// import { DrizzleDB } from 'src/db/types/drizzle';
import * as schema from './schemas/schema';
import { eq } from 'drizzle-orm';
import { UserNotFoundException } from 'src/common/exceptions/errors/user/user-no-exist.exception';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

@Injectable()
export class UserService {
  constructor(
    @Inject(DRIZZLE_CLIENT) private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async create(user: typeof schema.userTable.$inferInsert) {
    const result = await this.db
      .insert(schema.userTable)
      .values(user)
      .returning();
    return result[0];
    // return this.db.query.userTable.insert(user).returning();
  }

  async findByEmail(email: string) {
    const result = await this.db
      .select()
      .from(schema.userTable)
      .where(eq(schema.userTable.email, email))
      .limit(1);

    return result[0];
  }

  async findById(id: string) {
    const result = await this.db
      .select()
      .from(schema.userTable)
      .where(eq(schema.userTable.id, id))
      .limit(1);
    return result[0];
  }

  async findByUsername(username: string) {
    const result = await this.db
      .select()
      .from(schema.userTable)
      .where(eq(schema.userTable.username, username))
      .limit(1);
    return result[0];
  }

  async findByGoogleId(googleId: string) {
    const result = await this.db
      .select()
      .from(schema.userTable)
      .where(eq(schema.userTable.googleId, googleId))
      .limit(1);
    return result[0];
  }

  async findRefreshToken(userId: string) {
    const result = await this.db
      .select()
      .from(schema.refreshTokenTable)
      .where(eq(schema.refreshTokenTable.userId, userId))
      .limit(1);
    return result[0];
  }

  async updateToken(userId: string, refresTokenStr: string) {
    const updatedToken = await this.db
      .update(schema.refreshTokenTable)
      .set({ token: refresTokenStr })
      .where(eq(schema.refreshTokenTable.userId, userId))
      .returning({ userId: schema.refreshTokenTable.userId });
    return updatedToken[0];
  }

  async createToken(userId: string, refresTokenStr: string | null) {
    return this.db
      .insert(schema.refreshTokenTable)
      .values({ token: refresTokenStr, userId })
      .returning({ userId: schema.refreshTokenTable.userId });
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

  async getUserAndRefreshtokenByUserId(id: string) {
    const user = await this.db.query.userTable.findFirst({
      where: eq(schema.userTable.id, id),
      with: { resfreshToken: true },
    });
    return user;
  }

  async updateUserPassword(id: string, hashedPassword: string) {
    const result = await this.db
      .update(schema.userTable)
      .set({ password: hashedPassword })
      .where(eq(schema.userTable.id, id))
      .returning();
    return result[0];
  }
}
