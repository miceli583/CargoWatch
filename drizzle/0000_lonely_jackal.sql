CREATE TABLE "cargowatch_comment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"incident_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"content" text NOT NULL,
	"parent_comment_id" uuid,
	"is_edited" boolean DEFAULT false NOT NULL,
	"is_flagged" boolean DEFAULT false NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cargowatch_evidence" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"incident_id" uuid NOT NULL,
	"uploaded_by" uuid NOT NULL,
	"file_type" varchar(50) NOT NULL,
	"file_url" text NOT NULL,
	"file_name" varchar(255) NOT NULL,
	"file_size" integer,
	"mime_type" varchar(100),
	"caption" text,
	"metadata" jsonb,
	"uploaded_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cargowatch_incident" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reporter_id" uuid NOT NULL,
	"incident_type" varchar(100) NOT NULL,
	"severity_level" varchar(50) NOT NULL,
	"cargo_type" varchar(100),
	"status" varchar(50) DEFAULT 'active' NOT NULL,
	"region" varchar(100) NOT NULL,
	"specific_location" text NOT NULL,
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7),
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"incident_date" timestamp with time zone NOT NULL,
	"incident_time" varchar(20),
	"has_photos" boolean DEFAULT false NOT NULL,
	"has_video" boolean DEFAULT false NOT NULL,
	"evidence_count" integer DEFAULT 0 NOT NULL,
	"estimated_loss" numeric(12, 2),
	"view_count" integer DEFAULT 0 NOT NULL,
	"comment_count" integer DEFAULT 0 NOT NULL,
	"share_count" integer DEFAULT 0 NOT NULL,
	"reporter_name" varchar(255),
	"reporter_company" varchar(255),
	"reporter_contact" varchar(255),
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cargowatch_notification" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" varchar(50) NOT NULL,
	"title" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"link_url" text,
	"link_incident_id" uuid,
	"is_read" boolean DEFAULT false NOT NULL,
	"read_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cargowatch_region" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"state" varchar(2) NOT NULL,
	"city" varchar(255) NOT NULL,
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7),
	"is_priority" boolean DEFAULT false NOT NULL,
	"priority_rank" integer,
	"incident_count" integer DEFAULT 0 NOT NULL,
	"description" text,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "cargowatch_region_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "cargowatch_resource" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category" varchar(100) NOT NULL,
	"subcategory" varchar(100),
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"url" text,
	"company_url" text,
	"badge" varchar(50),
	"icon_type" varchar(50),
	"image_url" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cargowatch_user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"auth_id" uuid NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone_number" varchar(50),
	"company" varchar(255),
	"role" varchar(50) DEFAULT 'member' NOT NULL,
	"approval_status" varchar(50) DEFAULT 'pending' NOT NULL,
	"approved_by" uuid,
	"approved_at" timestamp with time zone,
	"rejection_reason" text,
	"email_verified" boolean DEFAULT false NOT NULL,
	"email_verified_at" timestamp with time zone,
	"account_status" varchar(50) DEFAULT 'active' NOT NULL,
	"terms_accepted_at" timestamp with time zone,
	"company_role" varchar(100),
	"mc_number" varchar(50),
	"dot_number" varchar(50),
	"badge_number" varchar(50),
	"department" varchar(100),
	"avatar_url" text,
	"bio" text,
	"is_verified" boolean DEFAULT false NOT NULL,
	"notifications_enabled" boolean DEFAULT true NOT NULL,
	"email_alerts_enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"last_login_at" timestamp with time zone,
	CONSTRAINT "cargowatch_user_auth_id_unique" UNIQUE("auth_id"),
	CONSTRAINT "cargowatch_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "cargowatch_comment" ADD CONSTRAINT "cargowatch_comment_incident_id_cargowatch_incident_id_fk" FOREIGN KEY ("incident_id") REFERENCES "public"."cargowatch_incident"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cargowatch_comment" ADD CONSTRAINT "cargowatch_comment_user_id_cargowatch_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."cargowatch_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cargowatch_evidence" ADD CONSTRAINT "cargowatch_evidence_incident_id_cargowatch_incident_id_fk" FOREIGN KEY ("incident_id") REFERENCES "public"."cargowatch_incident"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cargowatch_evidence" ADD CONSTRAINT "cargowatch_evidence_uploaded_by_cargowatch_user_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."cargowatch_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cargowatch_incident" ADD CONSTRAINT "cargowatch_incident_reporter_id_cargowatch_user_id_fk" FOREIGN KEY ("reporter_id") REFERENCES "public"."cargowatch_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cargowatch_notification" ADD CONSTRAINT "cargowatch_notification_user_id_cargowatch_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."cargowatch_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cargowatch_user" ADD CONSTRAINT "cargowatch_user_approved_by_cargowatch_user_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."cargowatch_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "comment_incident_idx" ON "cargowatch_comment" USING btree ("incident_id");--> statement-breakpoint
CREATE INDEX "comment_user_idx" ON "cargowatch_comment" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "comment_created_at_idx" ON "cargowatch_comment" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "evidence_incident_idx" ON "cargowatch_evidence" USING btree ("incident_id");--> statement-breakpoint
CREATE INDEX "evidence_uploader_idx" ON "cargowatch_evidence" USING btree ("uploaded_by");--> statement-breakpoint
CREATE INDEX "incident_reporter_idx" ON "cargowatch_incident" USING btree ("reporter_id");--> statement-breakpoint
CREATE INDEX "incident_type_idx" ON "cargowatch_incident" USING btree ("incident_type");--> statement-breakpoint
CREATE INDEX "incident_severity_idx" ON "cargowatch_incident" USING btree ("severity_level");--> statement-breakpoint
CREATE INDEX "incident_region_idx" ON "cargowatch_incident" USING btree ("region");--> statement-breakpoint
CREATE INDEX "incident_status_idx" ON "cargowatch_incident" USING btree ("status");--> statement-breakpoint
CREATE INDEX "incident_date_idx" ON "cargowatch_incident" USING btree ("incident_date");--> statement-breakpoint
CREATE INDEX "incident_created_at_idx" ON "cargowatch_incident" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "notification_user_idx" ON "cargowatch_notification" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "notification_read_idx" ON "cargowatch_notification" USING btree ("is_read");--> statement-breakpoint
CREATE INDEX "notification_created_at_idx" ON "cargowatch_notification" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "region_state_idx" ON "cargowatch_region" USING btree ("state");--> statement-breakpoint
CREATE INDEX "region_priority_idx" ON "cargowatch_region" USING btree ("is_priority");--> statement-breakpoint
CREATE INDEX "resource_category_idx" ON "cargowatch_resource" USING btree ("category");--> statement-breakpoint
CREATE INDEX "resource_active_idx" ON "cargowatch_resource" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "user_email_idx" ON "cargowatch_user" USING btree ("email");--> statement-breakpoint
CREATE INDEX "user_auth_id_idx" ON "cargowatch_user" USING btree ("auth_id");--> statement-breakpoint
CREATE INDEX "user_role_idx" ON "cargowatch_user" USING btree ("role");--> statement-breakpoint
CREATE INDEX "user_approval_status_idx" ON "cargowatch_user" USING btree ("approval_status");--> statement-breakpoint
CREATE INDEX "user_account_status_idx" ON "cargowatch_user" USING btree ("account_status");