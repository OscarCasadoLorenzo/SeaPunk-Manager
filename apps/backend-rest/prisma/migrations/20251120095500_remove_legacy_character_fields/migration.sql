/*
  Warnings:

  - You are about to drop the column `attackDomain` on the `characters` table. All the data in the column will be lost.
  - You are about to drop the column `bcat` on the `characters` table. All the data in the column will be lost.
  - You are about to drop the column `defenseDomain` on the `characters` table. All the data in the column will be lost.
  - You are about to drop the column `impactDomain` on the `characters` table. All the data in the column will be lost.
  - You are about to drop the column `mentalResistanceDomain` on the `characters` table. All the data in the column will be lost.
  - You are about to drop the column `physicalResistanceDomain` on the `characters` table. All the data in the column will be lost.
  - You are about to drop the column `powerLevel` on the `characters` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "characters" DROP COLUMN "attackDomain",
DROP COLUMN "bcat",
DROP COLUMN "defenseDomain",
DROP COLUMN "impactDomain",
DROP COLUMN "mentalResistanceDomain",
DROP COLUMN "physicalResistanceDomain",
DROP COLUMN "powerLevel";
