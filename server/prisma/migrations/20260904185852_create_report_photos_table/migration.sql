-- CreateTable
CREATE TABLE `report_photos` (
    `id` VARCHAR(191) NOT NULL,
    `report_id` VARCHAR(191) NOT NULL,
    `url` TEXT NOT NULL,
    `provider` VARCHAR(50) NULL,
    `provider_file_id` VARCHAR(255) NULL,
    `mime_type` VARCHAR(100) NULL,
    `size_bytes` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `report_photos_report_id_idx`(`report_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `report_photos` ADD CONSTRAINT `report_photos_report_id_fkey` FOREIGN KEY (`report_id`) REFERENCES `reports`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
