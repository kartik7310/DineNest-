/*
  Warnings:

  - You are about to drop the column `cartItems` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `order` table. All the data in the column will be lost.
  - You are about to alter the column `cuisines` on the `restaurant` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.
  - Added the required column `updatedAt` to the `Menu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deliveryDetailsId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `menu` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `cartItems`,
    DROP COLUMN `totalAmount`,
    ADD COLUMN `deliveryDetailsId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `restaurant` MODIFY `cuisines` JSON NULL;

-- CreateTable
CREATE TABLE `DeliveryDetails` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `DeliveryDetails_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_deliveryDetailsId_fkey` FOREIGN KEY (`deliveryDetailsId`) REFERENCES `DeliveryDetails`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
