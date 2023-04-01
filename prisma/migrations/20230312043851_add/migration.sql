/*
  Warnings:

  - You are about to drop the `TestUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "TestUser";

-- CreateTable
CREATE TABLE "Test" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT DEFAULT '',
    "role" "Role" NOT NULL DEFAULT 'BASIC',
    "name" TEXT NOT NULL,
    "avatarUrl" TEXT DEFAULT '',

    CONSTRAINT "Test_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Test_email_key" ON "Test"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Test_name_key" ON "Test"("name");
