-- DropForeignKey
ALTER TABLE `booking` DROP FOREIGN KEY `Booking_stationId_fkey`;

-- DropIndex
DROP INDEX `Booking_stationId_fkey` ON `booking`;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_stationId_fkey` FOREIGN KEY (`stationId`) REFERENCES `Station`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
