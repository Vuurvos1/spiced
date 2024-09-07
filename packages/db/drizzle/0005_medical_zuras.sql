CREATE TABLE IF NOT EXISTS "checkins" (
	"checkin_id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"hot_sauce_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "checkins_user_id_hot_sauce_id_unique" UNIQUE("user_id","hot_sauce_id")
);
--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "flagged" boolean DEFAULT false;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "checkins" ADD CONSTRAINT "checkins_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "checkins" ADD CONSTRAINT "checkins_hot_sauce_id_hot_sauces_id_fk" FOREIGN KEY ("hot_sauce_id") REFERENCES "public"."hot_sauces"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
