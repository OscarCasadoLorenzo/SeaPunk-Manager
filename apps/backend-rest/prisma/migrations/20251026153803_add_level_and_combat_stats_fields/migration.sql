/*
  Warnings:

  - You are about to drop the `Attribute` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AuraGift` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Character` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CharacterAuraGift` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CharacterEssence` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CombatStats` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Domain` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Effect` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Essence` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Health` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Inventory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Narrative` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Player` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Skill` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "InventoryType" AS ENUM ('WEAPON', 'ARMOR', 'CONSUMABLE', 'QUEST', 'OTHER');

-- DropForeignKey
ALTER TABLE "Attribute" DROP CONSTRAINT "Attribute_characterId_fkey";

-- DropForeignKey
ALTER TABLE "Character" DROP CONSTRAINT "Character_playerId_fkey";

-- DropForeignKey
ALTER TABLE "CharacterAuraGift" DROP CONSTRAINT "CharacterAuraGift_auraGiftId_fkey";

-- DropForeignKey
ALTER TABLE "CharacterAuraGift" DROP CONSTRAINT "CharacterAuraGift_characterId_fkey";

-- DropForeignKey
ALTER TABLE "CharacterEssence" DROP CONSTRAINT "CharacterEssence_characterId_fkey";

-- DropForeignKey
ALTER TABLE "CharacterEssence" DROP CONSTRAINT "CharacterEssence_essenceId_fkey";

-- DropForeignKey
ALTER TABLE "CombatStats" DROP CONSTRAINT "CombatStats_characterId_fkey";

-- DropForeignKey
ALTER TABLE "Effect" DROP CONSTRAINT "Effect_characterId_fkey";

-- DropForeignKey
ALTER TABLE "Effect" DROP CONSTRAINT "Effect_combatStatsId_fkey";

-- DropForeignKey
ALTER TABLE "Essence" DROP CONSTRAINT "Essence_domainId_fkey";

-- DropForeignKey
ALTER TABLE "Health" DROP CONSTRAINT "Health_characterId_fkey";

-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_characterId_fkey";

-- DropForeignKey
ALTER TABLE "Narrative" DROP CONSTRAINT "Narrative_characterId_fkey";

-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_userId_fkey";

-- DropForeignKey
ALTER TABLE "Skill" DROP CONSTRAINT "Skill_characterId_fkey";

-- DropTable
DROP TABLE "Attribute";

-- DropTable
DROP TABLE "AuraGift";

-- DropTable
DROP TABLE "Character";

-- DropTable
DROP TABLE "CharacterAuraGift";

-- DropTable
DROP TABLE "CharacterEssence";

-- DropTable
DROP TABLE "CombatStats";

-- DropTable
DROP TABLE "Domain";

-- DropTable
DROP TABLE "Effect";

-- DropTable
DROP TABLE "Essence";

-- DropTable
DROP TABLE "Health";

-- DropTable
DROP TABLE "Inventory";

-- DropTable
DROP TABLE "Narrative";

-- DropTable
DROP TABLE "Player";

-- DropTable
DROP TABLE "Skill";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "players" (
    "id" TEXT NOT NULL,
    "playerName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "characters" (
    "id" TEXT NOT NULL,
    "characterName" TEXT NOT NULL,
    "archetype" TEXT NOT NULL,
    "faction" TEXT NOT NULL,
    "race" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "epicPoints" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "isNPC" BOOLEAN NOT NULL DEFAULT false,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "playerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "characters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attributes" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "strength" INTEGER NOT NULL,
    "agility" INTEGER NOT NULL,
    "willpower" INTEGER NOT NULL,
    "luck" INTEGER NOT NULL,
    "intelligence" INTEGER NOT NULL,

    CONSTRAINT "attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "domains" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "physical" INTEGER NOT NULL,
    "combat" INTEGER NOT NULL,
    "social" INTEGER NOT NULL,
    "environmental" INTEGER NOT NULL,
    "stealth" INTEGER NOT NULL,
    "knowledge" INTEGER NOT NULL,
    "technical" INTEGER NOT NULL,
    "resources" INTEGER NOT NULL,
    "demonic" INTEGER NOT NULL,
    "aura" INTEGER NOT NULL,

    CONSTRAINT "domains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "combat_stats" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "physicalHealth" INTEGER NOT NULL,
    "maxPhysicalHealth" INTEGER NOT NULL,
    "physicalResistance" INTEGER NOT NULL,
    "maxPhysicalResistance" INTEGER NOT NULL,
    "mentalHealth" INTEGER NOT NULL,
    "maxMentalHealth" INTEGER NOT NULL,
    "mentalResistance" INTEGER NOT NULL,
    "maxMentalResistance" INTEGER NOT NULL,
    "auraHealth" INTEGER NOT NULL DEFAULT 0,
    "maxAuraHealth" INTEGER NOT NULL DEFAULT 0,
    "auraResistance" INTEGER NOT NULL DEFAULT 0,
    "maxAuraResistance" INTEGER NOT NULL DEFAULT 0,
    "initiative" INTEGER NOT NULL,
    "armorClass" INTEGER NOT NULL DEFAULT 10,
    "conditions" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "combat_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "narratives" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "physicalDescription" TEXT,
    "externalProfile" TEXT,
    "internalProfile" TEXT,
    "background" TEXT,
    "specialties" TEXT,

    CONSTRAINT "narratives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventories" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "type" "InventoryType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "effects" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "effects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "essences" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "essences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aura_gifts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "aura_gifts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "character_essences" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "essenceId" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "character_essences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "character_aura_gifts" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "auraGiftId" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "character_aura_gifts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "attributes_characterId_key" ON "attributes"("characterId");

-- CreateIndex
CREATE UNIQUE INDEX "domains_characterId_key" ON "domains"("characterId");

-- CreateIndex
CREATE UNIQUE INDEX "combat_stats_characterId_key" ON "combat_stats"("characterId");

-- CreateIndex
CREATE UNIQUE INDEX "narratives_characterId_key" ON "narratives"("characterId");

-- CreateIndex
CREATE UNIQUE INDEX "essences_name_key" ON "essences"("name");

-- CreateIndex
CREATE UNIQUE INDEX "aura_gifts_name_key" ON "aura_gifts"("name");

-- CreateIndex
CREATE UNIQUE INDEX "character_essences_characterId_essenceId_key" ON "character_essences"("characterId", "essenceId");

-- CreateIndex
CREATE UNIQUE INDEX "character_aura_gifts_characterId_auraGiftId_key" ON "character_aura_gifts"("characterId", "auraGiftId");

-- AddForeignKey
ALTER TABLE "characters" ADD CONSTRAINT "characters_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attributes" ADD CONSTRAINT "attributes_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "domains" ADD CONSTRAINT "domains_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combat_stats" ADD CONSTRAINT "combat_stats_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "narratives" ADD CONSTRAINT "narratives_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventories" ADD CONSTRAINT "inventories_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "effects" ADD CONSTRAINT "effects_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "character_essences" ADD CONSTRAINT "character_essences_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "character_essences" ADD CONSTRAINT "character_essences_essenceId_fkey" FOREIGN KEY ("essenceId") REFERENCES "essences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "character_aura_gifts" ADD CONSTRAINT "character_aura_gifts_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "character_aura_gifts" ADD CONSTRAINT "character_aura_gifts_auraGiftId_fkey" FOREIGN KEY ("auraGiftId") REFERENCES "aura_gifts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
