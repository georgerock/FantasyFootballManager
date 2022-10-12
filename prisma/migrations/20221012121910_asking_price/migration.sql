/*
  Warnings:

  - You are about to drop the column `price` on the `Transfer` table. All the data in the column will be lost.
  - Added the required column `askingPrice` to the `Transfer` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transfer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "askingPrice" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    "originTeamId" INTEGER NOT NULL,
    "destinationTeamId" INTEGER,
    CONSTRAINT "Transfer_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transfer_originTeamId_fkey" FOREIGN KEY ("originTeamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transfer_destinationTeamId_fkey" FOREIGN KEY ("destinationTeamId") REFERENCES "Team" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Transfer" ("createdAt", "destinationTeamId", "id", "originTeamId", "playerId", "updatedAt") SELECT "createdAt", "destinationTeamId", "id", "originTeamId", "playerId", "updatedAt" FROM "Transfer";
DROP TABLE "Transfer";
ALTER TABLE "new_Transfer" RENAME TO "Transfer";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
