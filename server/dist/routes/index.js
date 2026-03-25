import { Router } from "express";
import webhookRoutes from "./webhook.route.js";
import authRouter from "./auth.route.js";
const router = Router();
router.use("/webhooks", webhookRoutes);
router.use("/auth", authRouter);
export default router;
//# sourceMappingURL=index.js.map