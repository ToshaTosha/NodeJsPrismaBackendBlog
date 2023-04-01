/*
  Warnings:

  - You are about to drop the `Test` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "passwordHash" DROP DEFAULT;

-- DropTable
DROP TABLE "Test";
