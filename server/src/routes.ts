import { Router } from "express";
import authRoutes from './modules/auth/auth.routes'
import reportRoutes from './modules/reports/report.routes'
import verificationRoutes from './modules/reports/report.routes'

const router = Router()

router.get("/health", (req, res) => {
    res.status(200).json({
        message: "OK"
    })
})

router.use("/auth", authRoutes)
router.use("/reports", reportRoutes)
router.use("/verification", verificationRoutes)

export default router;

