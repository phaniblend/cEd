import fs from "fs";
import path from "path";
import { createAppAuth } from "@octokit/auth-app";

export function getAppClient() {
  // ALWAYS resolve absolute path safely on Windows
  const keyPath = path.resolve(process.cwd(), "secrets", "contributebe.2025-11-22.private-key.pem");

  const privateKey = fs.readFileSync(keyPath, "utf8").toString();

  const auth = createAppAuth({
    appId: process.env.GITHUB_APP_ID,
    privateKey,
  });

  return auth;
}
