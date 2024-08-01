import {
	boolean,
	integer,
	pgTable,
	primaryKey,
	serial,
	text,
	timestamp,
	varchar
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	registeredAt: timestamp('registered_at').notNull().defaultNow(),
	username: varchar('username', { length: 16 }).notNull().unique('uq_users_username'),
	bio: text('bio'),
	hasBlue: boolean('has_blue').notNull().default(false)
});

export const usersRelations = relations(users, ({ many }) => ({
	followers: many(followers, { relationName: 'user_followers' }),
	following: many(followers, { relationName: 'user_follows' }),
	tweets: many(tweets),
	likes: many(likes)
}));

export const followers = pgTable(
	'followers',
	{
		userId: integer('user_id')
			.notNull()
			.references(() => users.id),
		followsUserId: integer('follows_user_id')
			.notNull()
			.references(() => users.id)
	},
	(followers) => ({
		pk: primaryKey(followers.userId, followers.followsUserId)
	})
);

export const followersRelations = relations(followers, ({ one }) => ({
	user: one(users, {
		fields: [followers.userId],
		references: [users.id],
		relationName: 'user_followers'
	}),
	followsUser: one(users, {
		fields: [followers.followsUserId],
		references: [users.id],
		relationName: 'user_follows'
	})
}));

export const tweets = pgTable('tweets', {
	id: serial('id').primaryKey(),
	postedAt: timestamp('posted_at').notNull().defaultNow(),
	content: text('content').notNull(),
	postedById: integer('posted_by_id')
		.notNull()
		.references(() => users.id)
});

export const tweetsRelations = relations(tweets, ({ one }) => ({
	postedBy: one(users, {
		fields: [tweets.postedById],
		references: [users.id]
	})
}));

export const likes = pgTable(
	'likes',
	{
		likedTweetId: integer('liked_tweet_id')
			.notNull()
			.references(() => tweets.id),
		likedById: integer('liked_by_id')
			.notNull()
			.references(() => users.id)
	},
	(likes) => ({
		pk: primaryKey(likes.likedById, likes.likedTweetId)
	})
);

export const likesRelations = relations(likes, ({ one }) => ({
	likedTweet: one(tweets, {
		fields: [likes.likedTweetId],
		references: [tweets.id]
	}),
	likedBy: one(users, {
		fields: [likes.likedById],
		references: [users.id]
	})
}));
