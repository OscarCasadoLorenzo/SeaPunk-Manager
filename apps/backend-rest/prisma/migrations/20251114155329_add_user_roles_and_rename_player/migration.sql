/*
  Warnings:

  - You are about to drop the column `playerId` on the `characters` table. All the data in the column will be lost.
  - You are about to drop the `players` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `characters` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'MASTER', 'PLAYER');

-- Step 1: Add role column to users with default
ALTER TABLE "users" ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'PLAYER';

-- Step 2: Migrate data from players to users (if any existing players don't have user accounts)
-- Insert players as users if they don't already exist
INSERT INTO "users" (id, email, name, password, role, "createdAt", "updatedAt")
SELECT 
  p.id,
  LOWER(p."playerName") || '@seapunk.local' as email, -- Generate email from playerName
  p."playerName" as name,
  '$2b$10$PLACEHOLDER' as password, -- Placeholder password hash - users will need to reset
  'PLAYER' as role,
  p."createdAt",
  p."updatedAt"
FROM "players" p
WHERE NOT EXISTS (SELECT 1 FROM "users" u WHERE u.id = p.id)
ON CONFLICT (id) DO NOTHING;

-- Step 3: Add userId column to characters (temporarily nullable)
ALTER TABLE "characters" ADD COLUMN "userId" TEXT;

-- Step 4: Copy playerId to userId
UPDATE "characters" SET "userId" = "playerId";

-- Step 5: Make userId required
ALTER TABLE "characters" ALTER COLUMN "userId" SET NOT NULL;

-- Step 6: Drop the old foreign key and column
ALTER TABLE "characters" DROP CONSTRAINT "characters_playerId_fkey";
ALTER TABLE "characters" DROP COLUMN "playerId";

-- Step 7: Drop the players table
DROP TABLE "players";

-- Step 8: Add new foreign key
ALTER TABLE "characters" ADD CONSTRAINT "characters_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
