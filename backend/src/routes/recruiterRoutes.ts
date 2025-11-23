import express from "express";
import { getLearners, getLearnerDetails } from "../controllers/recruiterController.js";
import { authenticate, requireRole } from "../middlewares/auth.js";

const router = express.Router();

router.get("/learners", authenticate, requireRole("RECRUITER", "ADMIN"), getLearners);
router.get("/learners/:learnerId", authenticate, requireRole("RECRUITER", "ADMIN"), getLearnerDetails);

export default router;

