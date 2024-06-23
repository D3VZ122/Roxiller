/*
  Warnings:

  - Added the required column `Month` to the `ata` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ata" ADD COLUMN     "Month" TEXT NOT NULL;
