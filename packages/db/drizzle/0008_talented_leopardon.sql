ALTER TABLE "checkins" ADD COLUMN "review" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "checkins" DROP COLUMN IF EXISTS "review_text";