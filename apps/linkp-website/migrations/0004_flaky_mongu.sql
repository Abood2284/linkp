CREATE TABLE IF NOT EXISTS "collaborations" (
	"id" text PRIMARY KEY NOT NULL,
	"creator_id" text NOT NULL,
	"business_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"start_date" timestamp with time zone,
	"end_date" timestamp with time zone,
	"status" text DEFAULT 'active' NOT NULL,
	"metrics" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "collaborations" ADD CONSTRAINT "collaborations_creator_id_creators_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."creators"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "collaborations" ADD CONSTRAINT "collaborations_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
