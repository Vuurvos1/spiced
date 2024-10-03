DROP TABLE "reviews";--> statement-breakpoint
ALTER TABLE "checkins" ADD COLUMN "rating" integer;--> statement-breakpoint
ALTER TABLE "checkins" ADD COLUMN "review_text" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "checkins" ADD COLUMN "flagged" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "checkins" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;