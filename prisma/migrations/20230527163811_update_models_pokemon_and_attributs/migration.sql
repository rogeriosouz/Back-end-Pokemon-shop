/*
  Warnings:

  - You are about to drop the `PokemonAttribute` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "PokemonAttribute_attributeId_pokemonId_key";

-- DropIndex
DROP INDEX "PokemonAttribute_id_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PokemonAttribute";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "_AttributeToPokemon" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_AttributeToPokemon_A_fkey" FOREIGN KEY ("A") REFERENCES "Attribute" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_AttributeToPokemon_B_fkey" FOREIGN KEY ("B") REFERENCES "Pokemon" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Attribute" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "colorRex" TEXT NOT NULL,
    "create_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Attribute" ("colorRex", "create_at", "id", "name") SELECT "colorRex", "create_at", "id", "name" FROM "Attribute";
DROP TABLE "Attribute";
ALTER TABLE "new_Attribute" RENAME TO "Attribute";
CREATE UNIQUE INDEX "Attribute_id_key" ON "Attribute"("id");
CREATE TABLE "new_Pokemon" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "quant" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "create_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Pokemon" ("amount", "create_at", "id", "price", "quant", "title", "url") SELECT "amount", "create_at", "id", "price", "quant", "title", "url" FROM "Pokemon";
DROP TABLE "Pokemon";
ALTER TABLE "new_Pokemon" RENAME TO "Pokemon";
CREATE UNIQUE INDEX "Pokemon_id_key" ON "Pokemon"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_AttributeToPokemon_AB_unique" ON "_AttributeToPokemon"("A", "B");

-- CreateIndex
CREATE INDEX "_AttributeToPokemon_B_index" ON "_AttributeToPokemon"("B");
