CREATE TABLE IF NOT EXISTS "wishlist" (
	"wishlist_id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"hot_sauce_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "wishlist_user_id_hot_sauce_id_unique" UNIQUE("user_id","hot_sauce_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_hot_sauce_id_hot_sauces_id_fk" FOREIGN KEY ("hot_sauce_id") REFERENCES "public"."hot_sauces"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
