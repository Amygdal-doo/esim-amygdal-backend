import { relations } from 'drizzle-orm';
import { pgTable as table } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';
import { LoginType } from 'src/common/enums/loginType.enum';
import { Role } from 'src/common/enums/role.enum';
import { enumToPgEnum } from 'src/common/helpers/enum-to-pg_enum.helper';
import { primaryKey } from 'src/db/helpers/primary-key-gen.column.helper';
import { timestamps } from 'src/db/helpers/timestamps-column.helper';

export const roleEnum = t.pgEnum('role', enumToPgEnum(Role));
export const loginTypeEnum = t.pgEnum('loginType', enumToPgEnum(LoginType));

export const userTable = table(
  'user',
  {
    id: primaryKey,
    firstName: t.varchar('firstName', { length: 256 }).notNull(),
    lastName: t.varchar('lastName', { length: 256 }).notNull(),
    username: t.varchar('username', { length: 256 }).notNull().unique(),
    email: t.varchar('email', { length: 256 }).notNull().unique(),
    role: roleEnum().notNull(),
    loginType: loginTypeEnum().notNull(),
    googleId: t.varchar('googleId', { length: 100 }).unique(),
    appleId: t.varchar('appleId', { length: 100 }).unique(),
    password: t.text('password'),
    refreshToken: t.text('refreshToken'),
    ...timestamps,
  },
  (tab) => ({
    idIndex: t.index('idIndex').on(tab.id),
    emailIndex: t.index('emailIndex').on(tab.email),
    usernameIndex: t.index('usernameIndex').on(tab.username),
  }),
);

export const refreshTokenTable = table(
  'refreshToken',
  {
    id: primaryKey,
    userId: t
      .uuid('userId')
      .notNull()
      .references(() => userTable.id),
    token: t.text('token').notNull(),
    ...timestamps,
  },
  (tab) => ({
    userIdIndex: t.index('userIdIndex').on(tab.userId),
  }),
);

export const userRelations = relations(userTable, ({ one }) => ({
  resfreshToken: one(refreshTokenTable),
}));

export const refreshTokenRelations = relations(
  refreshTokenTable,
  ({ one }) => ({
    user: one(userTable, {
      fields: [refreshTokenTable.userId],
      references: [userTable.id],
    }),
  }),
);
