-- CreateTable
CREATE TABLE `audit_logs_archive` (
    `id` VARCHAR(36) NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,
    `action` VARCHAR(100) NOT NULL,
    `entity_type` VARCHAR(50) NOT NULL,
    `entity_id` VARCHAR(191) NULL,
    `details` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `audit_logs_archive_id_idx`(`id`),
    INDEX `audit_logs_archive_user_id_idx`(`user_id`),
    INDEX `audit_logs_archive_entity_type_entity_id_idx`(`entity_type`, `entity_id`),
    PRIMARY KEY (`created_at`, `id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
