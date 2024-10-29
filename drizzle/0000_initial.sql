CREATE TYPE "public"."loginType" AS ENUM('GOOGLE', 'APPLE', 'CREDENTIALS');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('USER', 'ADMIN', 'SUPER_ADMIN');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "refreshToken" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"token" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"firstName" varchar(256) NOT NULL,
	"lastName" varchar(256) NOT NULL,
	"username" varchar(256) NOT NULL,
	"email" varchar(256) NOT NULL,
	"role" "role" DEFAULT 'USER' NOT NULL,
	"loginType" "loginType" DEFAULT 'CREDENTIALS' NOT NULL,
	"googleId" varchar(100),
	"appleId" varchar(100),
	"password" text NOT NULL,
	"refreshToken" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	CONSTRAINT "user_username_unique" UNIQUE("username"),
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_googleId_unique" UNIQUE("googleId"),
	CONSTRAINT "user_appleId_unique" UNIQUE("appleId")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "refreshToken" ADD CONSTRAINT "refreshToken_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "userIdIndex" ON "refreshToken" USING btree ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idIndex" ON "user" USING btree ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "emailIndex" ON "user" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "usernameIndex" ON "user" USING btree ("username");