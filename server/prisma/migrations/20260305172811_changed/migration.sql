/*
  Warnings:

  - You are about to drop the column `timetake` on the `Move` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Move" DROP COLUMN "timetake",
ADD COLUMN     "timetaken" INTEGER DEFAULT 0;
