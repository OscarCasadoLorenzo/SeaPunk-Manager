/*
  Warnings:

  - You are about to drop the column `maxDamage` on the `combat_stats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "combat_stats" DROP COLUMN "maxDamage",
ADD COLUMN     "maxAttack" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "maxDefense" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "maxImpact" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "maxInitiative" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "initiative" SET DEFAULT 0,
ALTER COLUMN "defense" SET DEFAULT 0;
