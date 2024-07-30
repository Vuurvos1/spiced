import { pgTable, integer, serial, text, timestamp, varchar, bigint } from 'drizzle-orm/pg-core';

export const sauces = pgTable('sauces', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	description: text('description').default(''),
	scovile: integer('scovile'),
	// compoany, producer, makers?
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

// lucia auth
export const userTable = pgTable('user', {
	id: text('id').primaryKey()
});

export const sessionTable = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => userTable.id),
	expiresAt: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date'
	}).notNull()
});

// export const user = pgTable('auth_user', {
// 	id: varchar('id', {
// 		length: 15 // change this when using custom user ids
// 	}).primaryKey()
// 	// other user attributes
// });

// export const session = pgTable('user_session', {
// 	id: varchar('id', {
// 		length: 128
// 	}).primaryKey(),
// 	userId: varchar('user_id', {
// 		length: 15
// 	})
// 		.notNull()
// 		.references(() => user.id),
// 	activeExpires: bigint('active_expires', {
// 		mode: 'number'
// 	}).notNull(),
// 	idleExpires: bigint('idle_expires', {
// 		mode: 'number'
// 	}).notNull()
// });

// export const key = pgTable('user_key', {
// 	id: varchar('id', {
// 		length: 255
// 	}).primaryKey(),
// 	userId: varchar('user_id', {
// 		length: 15
// 	})
// 		.notNull()
// 		.references(() => user.id),
// 	hashedPassword: varchar('hashed_password', {
// 		length: 255
// 	})
// });
