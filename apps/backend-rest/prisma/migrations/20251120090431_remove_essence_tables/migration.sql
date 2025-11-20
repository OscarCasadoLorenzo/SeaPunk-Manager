/*
  Warnings:

  - You are about to drop the `character_essences` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `essences` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "character_essences" DROP CONSTRAINT "character_essences_characterId_fkey";

-- DropForeignKey
ALTER TABLE "character_essences" DROP CONSTRAINT "character_essences_essenceId_fkey";

-- DropTable
DROP TABLE "character_essences";

-- DropTable
DROP TABLE "essences";
