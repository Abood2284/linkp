CREATE TABLE IF NOT EXISTS "instagram_metrics_history" (
	"id" text PRIMARY KEY NOT NULL,
	"connection_id" text NOT NULL,
	"follower_count" integer,
	"following_count" integer,
	"media_count" integer,
	"avg_likes" integer,
	"avg_comments" integer,
	"avg_saves" integer,
	"avg_shares" integer,
	"engagement_rate" real,
	"linkp_clicks" integer,
	"linkp_conversions" integer,
	"linkp_ctr" real,
	"recorded_at" text DEFAULT 'CURRENT_TIMESTAMP'
);
--> statement-breakpoint
ALTER TABLE "instagram_connections" ADD COLUMN "name" text;--> statement-breakpoint
ALTER TABLE "instagram_connections" ADD COLUMN "account_type" text;--> statement-breakpoint
ALTER TABLE "instagram_connections" ADD COLUMN "profile_picture_url" text;--> statement-breakpoint
ALTER TABLE "instagram_connections" ADD COLUMN "following_count" integer;--> statement-breakpoint
ALTER TABLE "instagram_connections" ADD COLUMN "media_count" integer;--> statement-breakpoint
ALTER TABLE "instagram_connections" ADD COLUMN "avg_likes" integer;--> statement-breakpoint
ALTER TABLE "instagram_connections" ADD COLUMN "avg_comments" integer;--> statement-breakpoint
ALTER TABLE "instagram_connections" ADD COLUMN "avg_saves" integer;--> statement-breakpoint
ALTER TABLE "instagram_connections" ADD COLUMN "avg_shares" integer;--> statement-breakpoint
ALTER TABLE "instagram_connections" ADD COLUMN "engagement_rate" real;--> statement-breakpoint
ALTER TABLE "instagram_connections" ADD COLUMN "audience_demographics" json;--> statement-breakpoint
ALTER TABLE "instagram_connections" ADD COLUMN "updated_at" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "instagram_metrics_history" ADD CONSTRAINT "instagram_metrics_history_connection_id_instagram_connections_id_fk" FOREIGN KEY ("connection_id") REFERENCES "public"."instagram_connections"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
