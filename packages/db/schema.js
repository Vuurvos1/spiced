import {
	pgTable,
	integer,
	serial,
	text,
	timestamp,
	unique,
	varchar,
	primaryKey,
	boolean,
	pgEnum,
	uuid
} from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['admin', 'moderator', 'user']);

// auth
export const userTable = pgTable('user', {
	id: uuid('id').defaultRandom().primaryKey(),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash'),
	role: roleEnum('role').notNull().default('user'),

	email: text('email').notNull().unique(),
	emailVerified: boolean('is_email_verified').notNull().default(false),
	authMethods: text('auth_methods').array().notNull().default([]),

	createdAt: timestamp('created_at').notNull().defaultNow()
});

export const oauthAccountTable = pgTable(
	'oauth_account',
	{
		userId: uuid('user_id')
			.notNull()
			.references(() => userTable.id, { onDelete: 'cascade' }),
		providerId: text('provider').notNull(),
		providerUserId: text('provider_user_id').notNull(),
		createdAt: timestamp('created_at').notNull().defaultNow()
	},
	(t) => ({
		pk: primaryKey({ columns: [t.userId, t.providerId] })
	})
);

export const emailVerificationTable = pgTable('email_verification', {
	id: serial('id').primaryKey(),
	userId: uuid('user_id')
		.notNull()
		.references(() => userTable.id, { onDelete: 'cascade' }),
	email: text('email').notNull(),
	token: text('token').notNull(),
	expiresAt: timestamp('expires_at').notNull()
});

export const passwordResetTokenTable = pgTable('password_reset_token', {
	id: serial('id').primaryKey(),
	userId: uuid('user_id')
		.notNull()
		.references(() => userTable.id),
	tokenHash: text('token_hash').notNull().unique(),
	expiresAt: timestamp('expires_at').notNull()
});

export const sessionTable = pgTable('session', {
	id: text('id').primaryKey().notNull().unique(),
	userId: uuid('user_id')
		.notNull()
		.references(() => userTable.id, { onDelete: 'cascade' }),
	expiresAt: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date'
	}).notNull()
});

// app
export const makers = pgTable('makers', {
	makerId: serial('maker_id').primaryKey(),
	name: varchar('name', { length: 256 }).notNull().unique(),
	description: text('description').default(''),
	website: varchar('website', { length: 256 }),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at')
		.notNull()
		.defaultNow()
		// TODO: maybe replace these with sql`now()`?
		.$onUpdate(() => new Date())
});

export const hotSauces = pgTable('hot_sauces', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	description: text('description').default(''),
	imageUrl: text('image_url'),
	scovile: integer('scovile'),
	makerId: integer('maker_id').references(() => makers.makerId, {
		onDelete: 'set null'
	}),
	createdAt: timestamp('created_at')
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),

	updatedAt: timestamp('updated_at')
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date())
});

export const stores = pgTable('stores', {
	storeId: serial('store_id').primaryKey(),
	name: varchar('name', { length: 256 }).notNull().unique(),
	description: text('description').default(''),
	url: varchar('url', { length: 256 }).notNull(),
	// TODO: add country/loccation?
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at')
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date())
});

export const storeHotSauces = pgTable(
	'store_hot_sauces',
	{
		hotSauceId: serial('hot_sauce_id')
			.notNull()
			.references(() => hotSauces.id, { onDelete: 'cascade' }),
		storeId: serial('store_id')
			.notNull()
			.references(() => stores.storeId, { onDelete: 'cascade' }),
		url: varchar('url', { length: 256 }).notNull(),
		createdAt: timestamp('created_at').notNull().defaultNow(),
		updatedAt: timestamp('updated_at')
			.notNull()
			.defaultNow()
			.$onUpdate(() => new Date())
	},
	(t) => ({
		pk: primaryKey({ columns: [t.storeId, t.hotSauceId] })
	})
);

export const events = pgTable('events', {
	eventId: serial('event_id').primaryKey(),
	name: varchar('name', { length: 256 }).notNull(),
	description: text('description').default(''),
	eventDate: timestamp('event_date').notNull(),
	location: varchar('location', { length: 256 }),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

export const followers = pgTable(
	'followers',
	{
		followerId: serial('follower_id'),
		followerUserId: uuid('follower_user_id')
			.notNull()
			.references(() => userTable.id, { onDelete: 'cascade' }),
		followedUserId: uuid('followed_user_id')
			.notNull()
			.references(() => userTable.id, { onDelete: 'cascade' }),
		followedAt: timestamp('followed_at').defaultNow()
	},
	(t) => {
		return {
			pk: primaryKey({ columns: [t.followerUserId, t.followedUserId] })
		};
	}
);

export const friends = pgTable(
	'friends',
	{
		friendId: serial('friend_id'),
		userId: uuid('user_id')
			.notNull()
			.references(() => userTable.id, { onDelete: 'cascade' }),
		friendUserId: uuid('friend_user_id')
			.notNull()
			.references(() => userTable.id, { onDelete: 'cascade' }),
		becameFriendsAt: timestamp('became_friends_at').notNull().defaultNow()
	},
	(t) => ({
		pk: primaryKey({ columns: [t.userId, t.friendUserId] })
	})
);

export const wishlist = pgTable(
	'wishlist',
	{
		userId: uuid('user_id')
			.notNull()
			.references(() => userTable.id, { onDelete: 'cascade' }),
		hotSauceId: integer('hot_sauce_id')
			.notNull()
			.references(() => hotSauces.id, { onDelete: 'cascade' }),
		createdAt: timestamp('created_at').notNull().defaultNow()
	},
	(t) => ({
		pk: primaryKey({ columns: [t.userId, t.hotSauceId] })
	})
);

export const checkins = pgTable(
	'checkins',
	{
		userId: uuid('user_id')
			.notNull()
			.references(() => userTable.id, { onDelete: 'cascade' }),
		hotSauceId: integer('hot_sauce_id')
			.notNull()
			.references(() => hotSauces.id, { onDelete: 'cascade' }), // TODO: change to uuid?
		rating: integer('rating'), // .check((rating) => rating >= 1 && rating <= 5), rating INTEGER CHECK (rating >= 1 AND rating <= 5),
		review: text('review').default(''),
		flagged: boolean('flagged').default(false),
		createdAt: timestamp('created_at').notNull().defaultNow(),
		updatedAt: timestamp('updated_at')
			.notNull()
			.defaultNow()
			.$onUpdate(() => new Date())
	},
	(t) => ({
		pk: primaryKey({ columns: [t.userId, t.hotSauceId] })
	})
);
