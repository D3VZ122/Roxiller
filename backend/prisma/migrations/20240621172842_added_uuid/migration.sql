/*
  Warnings:

  - The primary key for the `ata` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "ata" DROP CONSTRAINT "ata_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "ata_pkey" PRIMARY KEY ("id");
