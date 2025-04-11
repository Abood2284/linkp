ALTER TABLE "instagram_connections" DROP CONSTRAINT "instagram_connections_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "workspaces" ADD COLUMN "creator_id" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_creator_id_creators_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."creators"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "instagram_connections" DROP COLUMN IF EXISTS "user_id";