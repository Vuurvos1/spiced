import {
	pgTable,
	integer,
	serial,
	text,
	timestamp,
	unique,
	varchar,
	primaryKey,
	boolean
} from 'drizzle-orm/pg-core';

// lucia auth
export const userTable = pgTable('user', {
	id: text('id').primaryKey(), // TODO: possible change to uuid, also update references
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash'),

	email: text('email').notNull().unique(),
	emailVerified: boolean('is_email_verified').notNull().default(false),
	authMethods: text('auth_methods').array().notNull().default([]),

	createdAt: timestamp('created_at').notNull().defaultNow()
});

export const oauthAccountTable = pgTable(
	'oauth_account',
	{
		userId: text('user_id')
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

export const sessionTable = pgTable('session', {
	id: text('id').primaryKey().notNull().unique(),
	userId: text('user_id')
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
	website: varchar('website', { length: 256 }),
	// TODO: add country/loccation?
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at')
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date())
});

export const hotSauceStores = pgTable(
	'hot_sauce_stores',
	{
		id: serial('id').primaryKey(),
		hotSauceId: integer('hot_sauce_id')
			.notNull()
			.references(() => hotSauces.id, { onDelete: 'cascade' }),
		storeId: integer('store_id')
			.notNull()
			.references(() => stores.storeId, { onDelete: 'cascade' }),
		// price: integer('price'),
		createdAt: timestamp('created_at').notNull().defaultNow(),
		updatedAt: timestamp('updated_at')
			.notNull()
			.defaultNow()
			.$onUpdate(() => new Date())
	},
	(t) => ({
		unq: unique().on(t.hotSauceId, t.storeId)
	})
);

export const reviews = pgTable(
	'reviews',
	{
		reviewId: serial('review_id').primaryKey(),
		userId: text('user_id')
			.notNull()
			.references(() => userTable.id, { onDelete: 'cascade' }),
		hotSauceId: integer('hot_sauce_id')
			.notNull()
			.references(() => hotSauces.id, { onDelete: 'cascade' }), // TODO: change to uuid?
		// ratings go from 1 to 6? where 6 is extreme heat
		rating: integer('rating'), // .check((rating) => rating >= 1 && rating <= 5), rating INTEGER CHECK (rating >= 1 AND rating <= 5),
		reviewText: text('review_text').default(''), // TODO: rename to content
		createdAt: timestamp('created_at').notNull().defaultNow(),
		updatedAt: timestamp('updated_at')
			.notNull()
			.defaultNow()
			.$onUpdate(() => new Date())
	},
	(t) => {
		return {
			unq: unique().on(t.userId, t.hotSauceId)
		};
	}
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
		followerId: serial('follower_id').primaryKey(),
		followerUserId: text('follower_user_id')
			.notNull()
			.references(() => userTable.id, { onDelete: 'cascade' }),
		followedUserId: text('followed_user_id')
			.notNull()
			.references(() => userTable.id, { onDelete: 'cascade' }),
		followedAt: timestamp('followed_at').defaultNow()
	},
	(t) => {
		return {
			unq: unique().on(t.followerUserId, t.followedUserId)
		};
	}
);

export const friends = pgTable(
	'friends',
	{
		friendId: serial('friend_id').primaryKey(),
		userId: text('user_id')
			.notNull()
			.references(() => userTable.id, { onDelete: 'cascade' }),
		friendUserId: text('friend_user_id')
			.notNull()
			.references(() => userTable.id, { onDelete: 'cascade' }),
		becameFriendsAt: timestamp('became_friends_at').notNull().defaultNow()
	},
	(t) => ({
		unq: unique().on(t.userId, t.friendUserId)
	})
);

export const wishlist = pgTable(
	'wishlist',
	{
		wishlistId: serial('wishlist_id').primaryKey(),
		userId: text('user_id')
			.notNull()
			.references(() => userTable.id, { onDelete: 'cascade' }),
		hotSauceId: integer('hot_sauce_id')
			.notNull()
			.references(() => hotSauces.id, { onDelete: 'cascade' }),
		createdAt: timestamp('created_at').notNull().defaultNow()
	},
	(t) => ({
		unq: unique().on(t.userId, t.hotSauceId)
	})
);
