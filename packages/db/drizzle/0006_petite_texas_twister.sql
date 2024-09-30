ALTER TABLE "checkins" DROP CONSTRAINT "checkins_user_id_hot_sauce_id_unique";--> statement-breakpoint
ALTER TABLE "wishlist" DROP CONSTRAINT "wishlist_user_id_hot_sauce_id_unique";--> statement-breakpoint
ALTER TABLE "checkins" DROP COLUMN IF EXISTS "checkin_id";--> statement-breakpoint
ALTER TABLE "wishlist" DROP COLUMN IF EXISTS "wishlist_id";
ALTER TABLE "checkins" ADD CONSTRAINT "checkins_user_id_hot_sauce_id_pk" PRIMARY KEY("user_id","hot_sauce_id");--> statement-breakpoint
ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_user_id_hot_sauce_id_pk" PRIMARY KEY("user_id","hot_sauce_id");--> statement-breakpoint
