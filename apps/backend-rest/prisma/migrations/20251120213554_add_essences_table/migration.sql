-- CreateTable
CREATE TABLE "essences" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "text" VARCHAR(200) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "essences_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "essences" ADD CONSTRAINT "essences_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;
