import express from "express";
import { getUserByEmail } from "../services/userService.js";

const router = express.Router();

router.get("/:email", async (req, res) => {
  const user = await getUserByEmail(req.params.email);
  return res.json({ success: true, user });
});

export default router;
