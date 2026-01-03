/*
  Warnings:

  - You are about to drop the column `slaHours` on the `Department` table. All the data in the column will be lost.
  - Added the required column `City` to the `Department` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Department" DROP COLUMN "slaHours",
ADD COLUMN     "City" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Grievance" ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT NOT NULL;
