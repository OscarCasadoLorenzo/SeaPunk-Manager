/*
  Warnings:

  - You are about to drop the column `auraHealth` on the `combat_stats` table. All the data in the column will be lost.
  - You are about to drop the column `auraResistance` on the `combat_stats` table. All the data in the column will be lost.
  - You are about to drop the column `conditions` on the `combat_stats` table. All the data in the column will be lost.
  - You are about to drop the column `maxAuraHealth` on the `combat_stats` table. All the data in the column will be lost.
  - You are about to drop the column `maxAuraResistance` on the `combat_stats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "combat_stats" DROP COLUMN "auraHealth",
DROP COLUMN "auraResistance",
DROP COLUMN "conditions",
DROP COLUMN "maxAuraHealth",
DROP COLUMN "maxAuraResistance";
