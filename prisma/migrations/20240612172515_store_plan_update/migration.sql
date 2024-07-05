/*
  Warnings:

  - You are about to drop the column `guest_list` on the `store` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `store` DROP COLUMN `guest_list`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
