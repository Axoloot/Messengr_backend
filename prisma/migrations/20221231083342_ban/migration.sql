-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "name" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "picture" TEXT NOT NULL DEFAULT E'';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "banned" BOOLEAN NOT NULL DEFAULT false;
