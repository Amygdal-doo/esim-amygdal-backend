import { sql } from 'drizzle-orm';
import { uuid } from 'drizzle-orm/pg-core';

export const primaryKey = uuid('id')
  .default(sql`gen_random_uuid()`)
  .primaryKey();
