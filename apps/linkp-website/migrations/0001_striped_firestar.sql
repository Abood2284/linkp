ALTER TABLE "user" ALTER COLUMN "user_type" SET DEFAULT 'creator';--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "user_type" DROP NOT NULL;