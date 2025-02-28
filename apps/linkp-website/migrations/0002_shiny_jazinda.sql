ALTER TYPE "public"."link_type" ADD VALUE 'promotional' BEFORE 'commerce';--> statement-breakpoint
ALTER TABLE "promotional_campaigns" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "promotional_content" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "promotional_campaigns" CASCADE;--> statement-breakpoint
DROP TABLE "promotional_content" CASCADE;--> statement-breakpoint
ALTER TABLE "workspace_links" ADD COLUMN "business_id" text;--> statement-breakpoint
ALTER TABLE "workspace_links" ADD COLUMN "promotion_start_date" timestamp;--> statement-breakpoint
ALTER TABLE "workspace_links" ADD COLUMN "promotion_end_date" timestamp;--> statement-breakpoint
ALTER TABLE "workspace_links" ADD COLUMN "promotion_status" text;--> statement-breakpoint
ALTER TABLE "workspace_links" ADD COLUMN "promotion_price" integer;--> statement-breakpoint
ALTER TABLE "workspace_links" ADD COLUMN "promotion_metrics" jsonb;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workspace_links" ADD CONSTRAINT "workspace_links_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "workspace_links_business_id_idx" ON "workspace_links" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "workspace_links_promotion_status_idx" ON "workspace_links" USING btree ("promotion_status");