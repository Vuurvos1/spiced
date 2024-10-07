ALTER TABLE "stores" RENAME COLUMN "website" TO "url";--> statement-breakpoint
ALTER TABLE "stores" ALTER COLUMN "url" SET NOT NULL;