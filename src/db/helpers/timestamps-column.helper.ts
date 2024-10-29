import { sql } from 'drizzle-orm';
import { timestamp } from 'drizzle-orm/pg-core';

export const timestamps = {
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'string' }).$onUpdate(
    () => sql`CURRENT_TIMESTAMP`,
  ),
  // updatedAt: timestamp('updatedAt')
  //   .default(sql`(CURRENT_TIMESTAMP)`)
  //   .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
  //   .notNull(),
};
