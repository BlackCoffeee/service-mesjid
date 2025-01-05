-- CreateTable
CREATE TABLE `mosques` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `codeName` VARCHAR(30) NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `village` VARCHAR(100) NOT NULL,
    `district` VARCHAR(100) NOT NULL,
    `city` VARCHAR(100) NOT NULL,
    `province` VARCHAR(100) NOT NULL,
    `postalCode` VARCHAR(10) NOT NULL,
    `latitude` DECIMAL(10, 7) NULL,
    `longitude` DECIMAL(10, 7) NULL,
    `establishmentDate` DATETIME(3) NULL,
    `phone` VARCHAR(15) NULL,
    `email` VARCHAR(100) NULL,
    `website` VARCHAR(100) NULL,
    `description` TEXT NULL,
    `status` ENUM('ACTIVE', 'RENOVATION', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `type` ENUM('GRAND_MOSQUE', 'JAMI_MOSQUE', 'PRAYER_ROOM') NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `mosques_codeName_key`(`codeName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `mosques` ADD CONSTRAINT `mosques_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
