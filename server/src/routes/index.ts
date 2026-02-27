import { Router } from "express";
import webhookRoutes from "./webhook.route.js";

const router: Router = Router();

router.use("/webhooks", webhookRoutes);

export default router;
