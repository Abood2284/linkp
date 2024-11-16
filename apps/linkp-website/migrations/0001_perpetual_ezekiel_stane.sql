CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN IF EXISTS "description";