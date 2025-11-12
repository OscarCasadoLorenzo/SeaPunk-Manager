/*
  Warnings:

  - Changed the type of `type` on the `inventories` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "characters" ADD COLUMN     "attackDomain" TEXT,
ADD COLUMN     "bcat" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "defenseDomain" TEXT,
ADD COLUMN     "impactDomain" TEXT,
ADD COLUMN     "mentalResistanceDomain" TEXT,
ADD COLUMN     "physicalResistanceDomain" TEXT,
ADD COLUMN     "powerLevel" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "inventories" DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL;
