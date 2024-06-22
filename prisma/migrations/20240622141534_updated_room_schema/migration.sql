/*
  Warnings:

  - You are about to drop the column `decryptkey` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `server` on the `Room` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Room" DROP COLUMN "decryptkey",
DROP COLUMN "server",
ALTER COLUMN "isValidKey" SET DEFAULT false;
