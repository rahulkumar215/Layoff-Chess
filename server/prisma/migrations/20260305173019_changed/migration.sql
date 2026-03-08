/*
  Warnings:

  - You are about to drop the column `timetaken` on the `Move` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Move" DROP COLUMN "timetaken",
ADD COLUMN     "timeTaken" INTEGER DEFAULT 0;
