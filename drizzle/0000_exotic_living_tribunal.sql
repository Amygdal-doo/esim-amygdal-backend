CREATE TYPE "public"."loginType" AS ENUM('GOOGLE', 'APPLE', 'CREDENTIALS');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('USER', 'ADMIN', 'SUPER_ADMIN');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"firstName" varchar(256) NOT NULL,
	"lastName" varchar(256) NOT NULL,
	"username" varchar(256) NOT NULL,
	"email" varchar(256) NOT NULL,
	"role" "role" DEFAULT 'USER' NOT NULL,
	"loginType" "loginType" DEFAULT 'CREDENTIALS' NOT NULL,
	"google_id" varchar(100),
	"apple_id" varchar(100),
	"password" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	CONSTRAINT "user_username_unique" UNIQUE("username"),
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_google_id_unique" UNIQUE("google_id"),
	CONSTRAINT "user_apple_id_unique" UNIQUE("apple_id")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idIndex" ON "user" USING btree ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "emailIndex" ON "user" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "usernameIndex" ON "user" USING btree ("username");