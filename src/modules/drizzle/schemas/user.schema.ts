import { sql } from 'drizzle-orm';
import { pgTable as table } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import { timestamps } from './helpers/timestamps-column.helper';
// import { roleEnum } from './enums/role.enum.schema';

export const loginTypeEnum = t.pgEnum('loginType', [
  'GOOGLE',
  'APPLE',
  'CREDENTIALS',
]);

export const roleEnum = t.pgEnum('role', ['USER', 'ADMIN', 'SUPER_ADMIN']);

export const userTable = table(
  'user',
  {
    id: t
      .uuid('id')
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    firstName: t.varchar('firstName', { length: 256 }).notNull(),
    lastName: t.varchar('lastName', { length: 256 }).notNull(),
    username: t.varchar('username', { length: 256 }).notNull().unique(),
    email: t.varchar('email', { length: 256 }).notNull().unique(),
    role: roleEnum().default('USER').notNull(),
    loginType: loginTypeEnum('loginType').default('CREDENTIALS').notNull(),
    googleId: t.varchar('google_id', { length: 100 }).unique(),
    appleId: t.varchar('apple_id', { length: 100 }).unique(),
    password: t.text('password').notNull(),
    ...timestamps,
  },
  (tab) => ({
    idIndex: t.index('idIndex').on(tab.id),
    emailIndex: t.index('emailIndex').on(tab.email),
    usernameIndex: t.index('usernameIndex').on(tab.username),
  }),
);
