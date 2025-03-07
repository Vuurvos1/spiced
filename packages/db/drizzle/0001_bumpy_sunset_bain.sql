ALTER TABLE
  "hot_sauces"
ADD
  COLUMN "slug" text;

--> statement-breakpoint
UPDATE
  "hot_sauces"
SET
  "slug" = lower(name);

--> statement-breakpoint
ALTER TABLE
  "hot_sauces"
ALTER COLUMN
  "slug"
SET
  NOT NULL;

--> statement-breakpoint
CREATE INDEX "slug_idx" ON "hot_sauces" USING btree ("slug");

--> statement-breakpoint
ALTER TABLE
  "hot_sauces" DROP COLUMN "scovile";

--> statement-breakpoint
ALTER TABLE
  "hot_sauces"
ADD
  CONSTRAINT "hot_sauces_slug_unique" UNIQUE("slug");
