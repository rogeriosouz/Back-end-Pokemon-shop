-- CreateTable
CREATE TABLE "Cart" (
    "id" TEXT NOT NULL,
    "total" REAL NOT NULL,
    "cont" INTEGER NOT NULL,
    "create_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Cart_id_key" ON "Cart"("id");
