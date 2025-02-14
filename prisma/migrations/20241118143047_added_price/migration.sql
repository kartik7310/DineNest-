/*
  Warnings:

  - Added the required column `price` to the `Restaurant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `restaurant` ADD COLUMN `price` INTEGER NOT NULL;
