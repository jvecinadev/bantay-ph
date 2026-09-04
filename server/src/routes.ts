import { Router } from "express";
import authRoutes from './modules/auth/auth.routes'

const router = Router()

router.get("/health", (req, res) => {
    res.status(200).json({
        message: "OK"
    })
})

router.use("/auth", authRoutes)

export default router;

