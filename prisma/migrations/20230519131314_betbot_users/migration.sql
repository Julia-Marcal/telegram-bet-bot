-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "leagues" TEXT[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);