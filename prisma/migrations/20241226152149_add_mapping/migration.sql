/*
  Warnings:

  - A unique constraint covering the columns `[userId,restaurantName]` on the table `Restaurant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Restaurant_userId_restaurantName_key` ON `Restaurant`(`userId`, `restaurantName`);
