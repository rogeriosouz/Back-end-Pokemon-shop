/*
  Warnings:

  - The primary key for the `PokemonAttribute` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PokemonAttribute" (
    "id" TEXT NOT NULL,
    "attributeId" TEXT NOT NULL,
    "pokemonId" TEXT NOT NULL,
    CONSTRAINT "PokemonAttribute_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "Attribute" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PokemonAttribute_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PokemonAttribute" ("attributeId", "id", "pokemonId") SELECT "attributeId", "id", "pokemonId" FROM "PokemonAttribute";
DROP TABLE "PokemonAttribute";
ALTER TABLE "new_PokemonAttribute" RENAME TO "PokemonAttribute";
CREATE UNIQUE INDEX "PokemonAttribute_id_key" ON "PokemonAttribute"("id");
CREATE UNIQUE INDEX "PokemonAttribute_attributeId_pokemonId_key" ON "PokemonAttribute"("attributeId", "pokemonId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
