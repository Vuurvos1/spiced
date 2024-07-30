import { Lucia } from 'lucia';
import { BetterSqlite3Adapter } from '@lucia-auth/adapter-sqlite';
import { dev } from '$app/environment';
import { db } from './db';

import type { DatabaseUser } from './db';

// TODO: get from db

const adapter = new BetterSqlite3Adapter(db, {
	user: 'user',
	session: 'session'
});

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: !dev
		}
	},
	getUserAttributes: (attributes) => {
		return {
			username: attributes.username
		};
	}
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: Omit<DatabaseUser, 'id'>;
	}
}

// import { Lucia } from 'lucia';
// // import { sveltekit } from 'lucia/middleware';
// import { dev } from '$app/environment';
// // import { postgres as postgresAdapter } from '@lucia-auth/adapter-postgresql';
// // import { DATABASE_URL } from '$env/static/private';

// import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';

// import pg from 'pg';

// import { sessionTable, userTable } from '$lib/db/schema';
// import { drizzle } from 'drizzle-orm/node-postgres';

// const pool = new pg.Pool();
// const db = drizzle(pool);

// // const userTable = pgTable('user', {
// // 	id: text('id').primaryKey()
// // });

// // const sessionTable = pgTable('session', {
// // 	id: text('id').primaryKey(),
// // 	userId: text('user_id')
// // 		.notNull()
// // 		.references(() => userTable.id),
// // 	expiresAt: timestamp('expires_at', {
// // 		withTimezone: true,
// // 		mode: 'date'
// // 	}).notNull()
// // });

// const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

// export const lucia = new Lucia(adapter, {
// 	sessionCookie: {
// 		attributes: {
// 			secure: !dev
// 		}
// 	},
// 	getUserAttributes: (attributes) => {
// 		return {
// 			// attributes has the type of DatabaseUserAttributes
// 			githubId: attributes.github_id,
// 			username: attributes.username
// 		};
// 	}
// });

// declare module 'lucia' {
// 	interface Register {
// 		Lucia: typeof lucia;
// 		DatabaseUserAttributes: DatabaseUserAttributes;
// 	}
// }

// interface DatabaseUserAttributes {
// 	github_id: number;
// 	username: string;
// }
