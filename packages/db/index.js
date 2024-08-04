import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

import * as schema from './schema.js';

/**
 * @param {string | undefined} dbUrl
 * @returns
 */
export function getDb(dbUrl) {
  if (!dbUrl) {
    throw new Error('Database URL is required');
  }

  const client = postgres(dbUrl);
  return drizzle(client, { schema });
}
