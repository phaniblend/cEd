import express from "express";
import { getInstallations } from "../controllers/githubInstallationsController.js";

const router = express.Router();

router.get("/", getInstallations);

export default router;
