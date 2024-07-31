import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

import { DATABASE_URL } from '$env/static/private';
import * as schema from '$lib/db/schema';

const client = postgres(DATABASE_URL!);
export const db = drizzle(client, { schema });
