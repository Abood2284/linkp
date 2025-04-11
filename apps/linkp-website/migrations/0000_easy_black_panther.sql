CREATE TYPE "public"."link_type" AS ENUM('social', 'regular', 'promotional', 'commerce', 'booking', 'newsletter', 'music', 'video', 'donation', 'poll', 'file');--> statement-breakpoint
CREATE TYPE "public"."proposal_status" AS ENUM('pending', 'accepted', 'rejected', 'expired');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('active', 'inactive', 'trial');--> statement-breakpoint
CREATE TYPE "public"."subscription_tier" AS ENUM('free', 'pro', 'business');--> statement-breakpoint
CREATE TYPE "public"."template_category" AS ENUM('minimal', 'creative', 'professional', 'animated');--> statement-breakpoint
CREATE TYPE "public"."time_bucket" AS ENUM('hour', 'day', 'week', 'month', 'year');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "aggregated_metrics" (
	"id" text PRIMARY KEY NOT NULL,
	"workspace_id" text NOT NULL,
	"link_id" text,
	"time_bucket" time_bucket NOT NULL,
	"bucket_start" timestamp with time zone NOT NULL,
	"bucket_end" timestamp with time zone NOT NULL,
	"metrics" jsonb NOT NULL,
	"last_updated" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "business_preferences" (
	"id" text PRIMARY KEY NOT NULL,
	"business_id" text NOT NULL,
	"creator_categories" text[],
	"min_followers" integer,
	"target_locations" text[],
	"link_objectives" text[],
	"target_audience_ages" text[],
	"target_audience_interests" text[],
	"link_metrics" text[],
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "businesses" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"subscription_tier" "subscription_tier" DEFAULT 'free',
	"subscription_status" "subscription_status" DEFAULT 'trial',
	"company_name" text NOT NULL,
	"industry" text,
	"website" text,
	"budget" integer,
	"billing_cycle" text DEFAULT 'monthly',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "creators" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"subscription_tier" "subscription_tier" DEFAULT 'free',
	"subscription_status" "subscription_status" DEFAULT 'trial',
	"default_workspace" text,
	"bio" text,
	"categories" text[],
	"social_proof" jsonb,
	"monetization_enabled" boolean DEFAULT false,
	"promotion_rate" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "link_events" (
	"id" text PRIMARY KEY NOT NULL,
	"link_id" text NOT NULL,
	"workspace_id" text NOT NULL,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL,
	"event_type" text NOT NULL,
	"visitor_id" text,
	"session_id" text,
	"metadata" jsonb
);
--> statement-breakpoint
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
CREATE TABLE IF NOT EXISTS "realtime_metrics" (
	"id" text PRIMARY KEY NOT NULL,
	"workspace_id" text NOT NULL,
	"link_id" text,
	"active_visitors" integer DEFAULT 0 NOT NULL,
	"recent_clicks" integer DEFAULT 0 NOT NULL,
	"last_updated" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"emailVerified" timestamp,
	"image" text,
	"user_type" text DEFAULT 'creator' NOT NULL,
	"onboarding_completed" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workspace_links" (
	"id" text PRIMARY KEY NOT NULL,
	"workspace_id" text NOT NULL,
	"type" "link_type" NOT NULL,
	"platform" text,
	"title" text NOT NULL,
	"url" text NOT NULL,
	"icon" text,
	"background_color" text,
	"text_color" text,
	"order" integer NOT NULL,
	"is_active" boolean DEFAULT true,
	"config" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workspaces" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"user_id" text NOT NULL,
	"avatar_url" text,
	"template_id" text NOT NULL,
	"template_config" json,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "workspaces_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "aggregated_metrics" ADD CONSTRAINT "aggregated_metrics_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "aggregated_metrics" ADD CONSTRAINT "aggregated_metrics_link_id_workspace_links_id_fk" FOREIGN KEY ("link_id") REFERENCES "public"."workspace_links"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "business_preferences" ADD CONSTRAINT "business_preferences_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "businesses" ADD CONSTRAINT "businesses_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "creators" ADD CONSTRAINT "creators_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "link_events" ADD CONSTRAINT "link_events_link_id_workspace_links_id_fk" FOREIGN KEY ("link_id") REFERENCES "public"."workspace_links"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "link_events" ADD CONSTRAINT "link_events_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
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
DO $$ BEGIN
 ALTER TABLE "realtime_metrics" ADD CONSTRAINT "realtime_metrics_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "realtime_metrics" ADD CONSTRAINT "realtime_metrics_link_id_workspace_links_id_fk" FOREIGN KEY ("link_id") REFERENCES "public"."workspace_links"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workspace_links" ADD CONSTRAINT "workspace_links_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "aggregated_metrics_time_idx" ON "aggregated_metrics" USING btree ("workspace_id","time_bucket","bucket_start");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "aggregated_metrics_link_time_idx" ON "aggregated_metrics" USING btree ("link_id","time_bucket","bucket_start");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "business_preferences_business_id_idx" ON "business_preferences" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "link_events_timestamp_idx" ON "link_events" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "link_events_workspace_idx" ON "link_events" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "link_events_link_idx" ON "link_events" USING btree ("link_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "link_events_visitor_idx" ON "link_events" USING btree ("workspace_id","visitor_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "promotional_metrics_link_idx" ON "promotional_link_metrics" USING btree ("workspace_link_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "promotional_metrics_business_idx" ON "promotional_link_metrics" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "promotional_proposals_business_idx" ON "promotional_link_proposals" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "promotional_proposals_creator_idx" ON "promotional_link_proposals" USING btree ("creator_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "promotional_proposals_workspace_idx" ON "promotional_link_proposals" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "promotional_proposals_status_idx" ON "promotional_link_proposals" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "workspace_links_workspace_id_idx" ON "workspace_links" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "workspace_links_order_idx" ON "workspace_links" USING btree ("workspace_id","order");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "workspace_links_platform_idx" ON "workspace_links" USING btree ("platform");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "workspace_slug_idx" ON "workspaces" USING btree ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "workspace_user_id_idx" ON "workspaces" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "workspace_template_id_idx" ON "workspaces" USING btree ("template_id");