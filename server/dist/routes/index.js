import { Router } from "express";
import webhookRoutes from "./webhook.route.js";
const router = Router();
router.use("/webhooks", webhookRoutes);
export default router;
//# sourceMappingURL=index.js.map