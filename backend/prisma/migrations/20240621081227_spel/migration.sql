/*
  Warnings:

  - You are about to drop the column `dateofsale` on the `ata` table. All the data in the column will be lost.
  - Added the required column `dateOfSale` to the `ata` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ata" DROP COLUMN "dateofsale",
ADD COLUMN     "dateOfSale" TIMESTAMP(3) NOT NULL;
