-- CreateTable
CREATE TABLE "InvalidTokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "create_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "InvalidTokens_id_key" ON "InvalidTokens"("id");
