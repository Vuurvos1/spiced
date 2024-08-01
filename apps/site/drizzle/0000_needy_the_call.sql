CREATE TABLE IF NOT EXISTS "events" (
	"event_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" text DEFAULT '',
	"event_date" timestamp NOT NULL,
	"location" varchar(256),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "followers" (
	"follower_id" serial PRIMARY KEY NOT NULL,
	"follower_user_id" text NOT NULL,
	"followed_user_id" text NOT NULL,
	"followed_at" timestamp DEFAULT now(),
	CONSTRAINT "followers_follower_user_id_followed_user_id_unique" UNIQUE("follower_user_id","followed_user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "friends" (
	"friend_id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"friend_user_id" text NOT NULL,
	"became_friends_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "friends_user_id_friend_user_id_unique" UNIQUE("user_id","friend_user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hot_sauce_stores" (
	"id" serial PRIMARY KEY NOT NULL,
	"hot_sauce_id" integer NOT NULL,
	"store_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "hot_sauce_stores_hot_sauce_id_store_id_unique" UNIQUE("hot_sauce_id","store_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hot_sauces" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text DEFAULT '',
	"scovile" integer,
	"maker_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "makers" (
	"maker_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" text DEFAULT '',
	"website" varchar(256),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "makers_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reviews" (
	"review_id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"hot_sauce_id" integer NOT NULL,
	"rating" integer,
	"review_text" text DEFAULT '',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "reviews_user_id_hot_sauce_id_unique" UNIQUE("user_id","hot_sauce_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stores" (
	"store_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" text DEFAULT '',
	"website" varchar(256),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "stores_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password_hash" text NOT NULL,
	CONSTRAINT "user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "followers" ADD CONSTRAINT "followers_follower_user_id_user_id_fk" FOREIGN KEY ("follower_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "followers" ADD CONSTRAINT "followers_followed_user_id_user_id_fk" FOREIGN KEY ("followed_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "friends" ADD CONSTRAINT "friends_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "friends" ADD CONSTRAINT "friends_friend_user_id_user_id_fk" FOREIGN KEY ("friend_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hot_sauce_stores" ADD CONSTRAINT "hot_sauce_stores_hot_sauce_id_hot_sauces_id_fk" FOREIGN KEY ("hot_sauce_id") REFERENCES "public"."hot_sauces"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hot_sauce_stores" ADD CONSTRAINT "hot_sauce_stores_store_id_stores_store_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("store_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hot_sauces" ADD CONSTRAINT "hot_sauces_maker_id_makers_maker_id_fk" FOREIGN KEY ("maker_id") REFERENCES "public"."makers"("maker_id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_hot_sauce_id_hot_sauces_id_fk" FOREIGN KEY ("hot_sauce_id") REFERENCES "public"."hot_sauces"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
