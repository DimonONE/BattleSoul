CREATE TABLE "battles" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"attacker_id" varchar NOT NULL,
	"target_id" varchar NOT NULL,
	"command" text NOT NULL,
	"emoji" text NOT NULL,
	"value" integer NOT NULL,
	"type" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pets" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"name" text NOT NULL,
	"emoji" text NOT NULL,
	"level" integer DEFAULT 1 NOT NULL,
	"hp" integer DEFAULT 50 NOT NULL,
	"max_hp" integer DEFAULT 50 NOT NULL,
	"strength" integer DEFAULT 10 NOT NULL,
	"evolution_stage" integer DEFAULT 1 NOT NULL,
	"max_evolution_stage" integer DEFAULT 5 NOT NULL,
	"owned" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"telegram_id" varchar NOT NULL,
	"username" text NOT NULL,
	"avatar" text,
	"hp" integer DEFAULT 100 NOT NULL,
	"max_hp" integer DEFAULT 100 NOT NULL,
	"xp" integer DEFAULT 0 NOT NULL,
	"lvl" integer DEFAULT 1 NOT NULL,
	"last_action" timestamp,
	"wins" integer DEFAULT 0 NOT NULL,
	"total_battles" integer DEFAULT 0 NOT NULL,
	"total_damage" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT '⚔️ Готовий до бою',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_telegram_id_unique" UNIQUE("telegram_id")
);
--> statement-breakpoint
ALTER TABLE "battles" ADD CONSTRAINT "battles_attacker_id_users_id_fk" FOREIGN KEY ("attacker_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "battles" ADD CONSTRAINT "battles_target_id_users_id_fk" FOREIGN KEY ("target_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pets" ADD CONSTRAINT "pets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;