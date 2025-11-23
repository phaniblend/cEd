import express from "express";
import { githubWebhookHandler } from "../webhooks/githubWebhookHandler.js";

const router = express.Router();

router.post("/", express.json({ type: "*/*" }), githubWebhookHandler);

export default router;
