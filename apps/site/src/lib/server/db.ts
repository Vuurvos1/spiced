// import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';

// import sqlite from 'better-sqlite3';
// import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
// import { drizzle } from 'drizzle-orm/better-sqlite3';

// const sqliteDB = sqlite('db.sqlite3');
// export const db = drizzle(sqliteDB);

// // TODO: move to a separate file
// const userTable = sqliteTable('user', {
// 	id: text('id').notNull().primaryKey(),
// 	username: text('username').notNull().unique(),
// 	passwordHash: text('password_hash').notNull()
// });

// const sessionTable = sqliteTable('session', {
// 	id: text('id').notNull().primaryKey(),
// 	userId: text('user_id')
// 		.notNull()
// 		.references(() => userTable.id),
// 	expiresAt: integer('expires_at').notNull()
// });

// export const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable);

import sqlite from 'better-sqlite3';

export const db = sqlite('db.sqlite');

db.exec(`CREATE TABLE IF NOT EXISTS user (
    id TEXT NOT NULL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL
)`);

db.exec(`CREATE TABLE IF NOT EXISTS session (
    id TEXT NOT NULL PRIMARY KEY,
    expires_at INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
)`);

export interface DatabaseUser {
	id: string;
	username: string;
	password_hash: string;
}
