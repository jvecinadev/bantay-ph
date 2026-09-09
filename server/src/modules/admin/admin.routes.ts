
import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth.middleware";
import { requireActiveAccount } from "../../middleware/requireActive.middleware";
import { requirePermission } from "../../middleware/requirePermission.middleware";
import { listAuditLogs, listUsers, updateUserRole, updateUserStatus } from "./admin.controller";
import { validate } from "../../middleware/validateRequest.middleware";
import { listUserSchema, updateUserRoleSchema, updateUserStatusSchema } from "./admin.validation";

const router = Router()

router.use(requireAuth, requireActiveAccount)
router.get("/users", requirePermission("user:read"), validate(listUserSchema), listUsers)
router.get("/audit-logs", requirePermission("audit:read"), listAuditLogs)
router.patch("/users/:id/role", requirePermission("user:update_role"), validate(updateUserRoleSchema), updateUserRole)
router.patch("/users/:id/status", requirePermission("user:update_status"), validate(updateUserStatusSchema), updateUserStatus)

export default router;