import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import githubInstallationsRoutes from "./src/routes/githubInstallationsRoutes.js";
import { generateAppJwt } from "./src/utils/generateAppJwt.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Generate JWT on startup
process.env.GH_APP_JWT = generateAppJwt();

// Routes
app.use("/api/github/installations", githubInstallationsRoutes);

app.get("/", (req, res) => {
  res.send("cEd Backend Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
