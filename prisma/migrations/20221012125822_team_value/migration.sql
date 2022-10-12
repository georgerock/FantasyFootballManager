-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Team" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "countryId" INTEGER NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "value" INTEGER NOT NULL DEFAULT 20000000,
    CONSTRAINT "Team_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Team_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Team" ("countryId", "createdAt", "id", "name", "ownerId", "updatedAt") SELECT "countryId", "createdAt", "id", "name", "ownerId", "updatedAt" FROM "Team";
DROP TABLE "Team";
ALTER TABLE "new_Team" RENAME TO "Team";
CREATE UNIQUE INDEX "Team_ownerId_key" ON "Team"("ownerId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
