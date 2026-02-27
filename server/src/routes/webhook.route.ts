import express from "express";
import { userController } from "../controllers/webhook.controllers.js";

const router = express.Router();

router.post("/", express.raw({ type: "application/json" }), userController);

export default router;
