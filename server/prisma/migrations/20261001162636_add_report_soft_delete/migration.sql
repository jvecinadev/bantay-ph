-- AlterTable
ALTER TABLE `reports` ADD COLUMN `deleted_at` DATETIME(3) NULL,
    ADD COLUMN `deleted_by` VARCHAR(36) NULL,
    ADD COLUMN `deleted_reason` VARCHAR(255) NULL;

-- CreateIndex
CREATE INDEX `reports_deleted_at_idx` ON `reports`(`deleted_at`);

-- CreateIndex
CREATE INDEX `reports_status_deleted_at_idx` ON `reports`(`status`, `deleted_at`);

-- CreateIndex
CREATE INDEX `reports_reporter_id_deleted_at_idx` ON `reports`(`reporter_id`, `deleted_at`);

-- AddForeignKey
ALTER TABLE `reports` ADD CONSTRAINT `reports_deleted_by_fkey` FOREIGN KEY (`deleted_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
