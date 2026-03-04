import { Router } from "express"
import { BatchController } from "../controllers/BatchController"
import { optionalAuth } from "../middleware/auth"

const router = Router()

router.post("/", optionalAuth, BatchController.registerBatch)
router.get("/history", optionalAuth, BatchController.getHistory)

export default router
