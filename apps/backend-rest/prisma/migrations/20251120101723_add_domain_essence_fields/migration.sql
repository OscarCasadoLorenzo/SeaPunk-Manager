-- AlterTable - Add new columns with default values first
ALTER TABLE "domains" ADD COLUMN "physicalValue" INTEGER;
ALTER TABLE "domains" ADD COLUMN "physicalEssence" TEXT NOT NULL DEFAULT '';
ALTER TABLE "domains" ADD COLUMN "combatValue" INTEGER;
ALTER TABLE "domains" ADD COLUMN "combatEssence" TEXT NOT NULL DEFAULT '';
ALTER TABLE "domains" ADD COLUMN "socialValue" INTEGER;
ALTER TABLE "domains" ADD COLUMN "socialEssence" TEXT NOT NULL DEFAULT '';
ALTER TABLE "domains" ADD COLUMN "environmentalValue" INTEGER;
ALTER TABLE "domains" ADD COLUMN "environmentalEssence" TEXT NOT NULL DEFAULT '';
ALTER TABLE "domains" ADD COLUMN "stealthValue" INTEGER;
ALTER TABLE "domains" ADD COLUMN "stealthEssence" TEXT NOT NULL DEFAULT '';
ALTER TABLE "domains" ADD COLUMN "knowledgeValue" INTEGER;
ALTER TABLE "domains" ADD COLUMN "knowledgeEssence" TEXT NOT NULL DEFAULT '';
ALTER TABLE "domains" ADD COLUMN "technicalValue" INTEGER;
ALTER TABLE "domains" ADD COLUMN "technicalEssence" TEXT NOT NULL DEFAULT '';
ALTER TABLE "domains" ADD COLUMN "resourcesValue" INTEGER;
ALTER TABLE "domains" ADD COLUMN "resourcesEssence" TEXT NOT NULL DEFAULT '';
ALTER TABLE "domains" ADD COLUMN "demonicValue" INTEGER;
ALTER TABLE "domains" ADD COLUMN "demonicEssence" TEXT NOT NULL DEFAULT '';
ALTER TABLE "domains" ADD COLUMN "auraValue" INTEGER;
ALTER TABLE "domains" ADD COLUMN "auraEssence" TEXT NOT NULL DEFAULT '';

-- Migrate existing data from old columns to new columns
UPDATE "domains" SET "physicalValue" = "physical";
UPDATE "domains" SET "combatValue" = "combat";
UPDATE "domains" SET "socialValue" = "social";
UPDATE "domains" SET "environmentalValue" = "environmental";
UPDATE "domains" SET "stealthValue" = "stealth";
UPDATE "domains" SET "knowledgeValue" = "knowledge";
UPDATE "domains" SET "technicalValue" = "technical";
UPDATE "domains" SET "resourcesValue" = "resources";
UPDATE "domains" SET "demonicValue" = "demonic";
UPDATE "domains" SET "auraValue" = "aura";

-- Make the new value columns NOT NULL after data migration
ALTER TABLE "domains" ALTER COLUMN "physicalValue" SET NOT NULL;
ALTER TABLE "domains" ALTER COLUMN "combatValue" SET NOT NULL;
ALTER TABLE "domains" ALTER COLUMN "socialValue" SET NOT NULL;
ALTER TABLE "domains" ALTER COLUMN "environmentalValue" SET NOT NULL;
ALTER TABLE "domains" ALTER COLUMN "stealthValue" SET NOT NULL;
ALTER TABLE "domains" ALTER COLUMN "knowledgeValue" SET NOT NULL;
ALTER TABLE "domains" ALTER COLUMN "technicalValue" SET NOT NULL;
ALTER TABLE "domains" ALTER COLUMN "resourcesValue" SET NOT NULL;
ALTER TABLE "domains" ALTER COLUMN "demonicValue" SET NOT NULL;
ALTER TABLE "domains" ALTER COLUMN "auraValue" SET NOT NULL;

-- Drop old columns
ALTER TABLE "domains" DROP COLUMN "physical";
ALTER TABLE "domains" DROP COLUMN "combat";
ALTER TABLE "domains" DROP COLUMN "social";
ALTER TABLE "domains" DROP COLUMN "environmental";
ALTER TABLE "domains" DROP COLUMN "stealth";
ALTER TABLE "domains" DROP COLUMN "knowledge";
ALTER TABLE "domains" DROP COLUMN "technical";
ALTER TABLE "domains" DROP COLUMN "resources";
ALTER TABLE "domains" DROP COLUMN "demonic";
ALTER TABLE "domains" DROP COLUMN "aura";
