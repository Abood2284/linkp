CREATE TYPE "public"."proposal_status" AS ENUM('pending', 'accepted', 'rejected', 'expired');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "promotional_link_metrics" (
	"id" text PRIMARY KEY NOT NULL,
	"workspace_link_id" text NOT NULL,
	"business_id" text NOT NULL,
	"impressions" integer DEFAULT 0,
	"clicks" integer DEFAULT 0,
	"conversions" integer DEFAULT 0,
	"revenue" integer DEFAULT 0,
	"last_updated" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "promotional_link_proposals" (
	"id" text PRIMARY KEY NOT NULL,
	"business_id" text NOT NULL,
	"creator_id" text NOT NULL,
	"workspace_id" text NOT NULL,
	"title" text NOT NULL,
	"url" text NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"price" integer NOT NULL,
	"status" "proposal_status" DEFAULT 'pending',
	"workspace_link_id" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "workspace_links" DROP CONSTRAINT "workspace_links_business_id_businesses_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "workspace_links_business_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "workspace_links_promotion_status_idx";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "promotional_link_metrics" ADD CONSTRAINT "promotional_link_metrics_workspace_link_id_workspace_links_id_fk" FOREIGN KEY ("workspace_link_id") REFERENCES "public"."workspace_links"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "promotional_link_metrics" ADD CONSTRAINT "promotional_link_metrics_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "promotional_link_proposals" ADD CONSTRAINT "promotional_link_proposals_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "promotional_link_proposals" ADD CONSTRAINT "promotional_link_proposals_creator_id_creators_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."creators"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "promotional_link_proposals" ADD CONSTRAINT "promotional_link_proposals_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "promotional_link_proposals" ADD CONSTRAINT "promotional_link_proposals_workspace_link_id_workspace_links_id_fk" FOREIGN KEY ("workspace_link_id") REFERENCES "public"."workspace_links"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "promotional_metrics_link_idx" ON "promotional_link_metrics" USING btree ("workspace_link_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "promotional_metrics_business_idx" ON "promotional_link_metrics" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "promotional_proposals_business_idx" ON "promotional_link_proposals" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "promotional_proposals_creator_idx" ON "promotional_link_proposals" USING btree ("creator_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "promotional_proposals_workspace_idx" ON "promotional_link_proposals" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "promotional_proposals_status_idx" ON "promotional_link_proposals" USING btree ("status");--> statement-breakpoint
ALTER TABLE "workspace_links" DROP COLUMN IF EXISTS "business_id";--> statement-breakpoint
ALTER TABLE "workspace_links" DROP COLUMN IF EXISTS "promotion_start_date";--> statement-breakpoint
ALTER TABLE "workspace_links" DROP COLUMN IF EXISTS "promotion_end_date";--> statement-breakpoint
ALTER TABLE "workspace_links" DROP COLUMN IF EXISTS "promotion_status";--> statement-breakpoint
ALTER TABLE "workspace_links" DROP COLUMN IF EXISTS "promotion_price";--> statement-breakpoint
ALTER TABLE "workspace_links" DROP COLUMN IF EXISTS "promotion_metrics";