ALTER TABLE "instagram_connections" DROP CONSTRAINT "instagram_connections_user_id_unique";--> statement-breakpoint
ALTER TABLE "instagram_connections" ADD COLUMN "workspace_id" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "instagram_connections" ADD CONSTRAINT "instagram_connections_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "instagram_connections" ADD CONSTRAINT "instagram_connections_workspace_id_unique" UNIQUE("workspace_id");