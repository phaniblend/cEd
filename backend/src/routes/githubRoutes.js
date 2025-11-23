import express from "express";
import {
  handleInstallation,
  handleWebhook,
} from "../controllers/githubController.js";
import { fetchInstallations } from "../services/githubService.js";

const router = express.Router();

// Webhook receiver
router.post("/webhook", handleWebhook);

// Installation CREATE callback (GitHub hits this)
router.post("/installations", handleInstallation);

// Installation FETCH (You hit this in browser)
router.get("/installations", async (req, res) => {
  try {
    const installations = await fetchInstallations();
    return res.json({ success: true, installations });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
