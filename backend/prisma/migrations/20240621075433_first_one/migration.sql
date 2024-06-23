-- CreateTable
CREATE TABLE "ata" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "catergory" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "sold" BOOLEAN NOT NULL,
    "dateofsale" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ata_pkey" PRIMARY KEY ("id")
);
