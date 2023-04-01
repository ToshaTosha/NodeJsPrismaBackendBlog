-- AlterTable
ALTER TABLE "User" ALTER COLUMN "avatarUrl" DROP NOT NULL,
ALTER COLUMN "passwordHash" SET DEFAULT '';

-- CreateTable
CREATE TABLE "TestUser" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT DEFAULT '',
    "role" "Role" NOT NULL DEFAULT 'BASIC',
    "name" TEXT NOT NULL,
    "avatarUrl" TEXT DEFAULT '',

    CONSTRAINT "TestUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TestUser_email_key" ON "TestUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TestUser_name_key" ON "TestUser"("name");
