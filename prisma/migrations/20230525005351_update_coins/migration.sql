/*
  Warnings:

  - Added the required column `coinsQuant` to the `Coins` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Coins" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "coinsQuant" REAL NOT NULL,
    "price" REAL NOT NULL,
    "description" TEXT NOT NULL,
    "create_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Coins" ("create_at", "description", "id", "name", "price") SELECT "create_at", "description", "id", "name", "price" FROM "Coins";
DROP TABLE "Coins";
ALTER TABLE "new_Coins" RENAME TO "Coins";
CREATE UNIQUE INDEX "Coins_id_key" ON "Coins"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
