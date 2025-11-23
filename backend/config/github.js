import fs from "fs";

export const GITHUB_CONFIG = {
  appId: process.env.GH_APP_ID,
  clientId: process.env.GH_CLIENT_ID,
  clientSecret: process.env.GH_CLIENT_SECRET,
  webhookSecret: process.env.GH_WEBHOOK_SECRET,
  privateKey: fs.readFileSync(
    "E:/cEd-GH/backend/secrets/contributebe.2025-11-22.private-key.pem",
    "utf8"
  ),
  org: process.env.GH_ORG || "icontributed",
  apiBase: "https://api.github.com"
};
