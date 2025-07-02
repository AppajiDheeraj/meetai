DROP TABLE "two_factor" CASCADE;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "two_factor_enabled";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "is_mfa_enabled";