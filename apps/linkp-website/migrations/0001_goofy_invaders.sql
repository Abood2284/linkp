CREATE TABLE IF NOT EXISTS "instagram_connections" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"instagram_user_id" text NOT NULL,
	"username" text,
	"access_token" text NOT NULL,
	"token_expires_at" text,
	"follower_count" integer,
	"last_synced_at" text,
	"created_at" text DEFAULT 'CURRENT_TIMESTAMP'
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "instagram_webhook_events" (
	"id" text PRIMARY KEY NOT NULL,
	"event_data" json,
	"processed" boolean DEFAULT false,
	"created_at" text DEFAULT 'CURRENT_TIMESTAMP'
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "instagram_connections" ADD CONSTRAINT "instagram_connections_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
