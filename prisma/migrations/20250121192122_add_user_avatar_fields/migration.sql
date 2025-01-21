-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" BYTEA,
ADD COLUMN     "avatarUrl" TEXT DEFAULT '/default-avatar.png';
