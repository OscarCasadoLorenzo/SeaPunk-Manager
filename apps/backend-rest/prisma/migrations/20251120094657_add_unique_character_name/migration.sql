/*
  Warnings:

  - A unique constraint covering the columns `[characterName]` on the table `characters` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "characters_characterName_key" ON "characters"("characterName");
