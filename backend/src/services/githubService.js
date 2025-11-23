import { App } from "octokit";
import fs from "fs";
import path from "path";

const APP_ID = process.env.GITHUB_APP_ID;
const PRIVATE_KEY = fs.readFileSync(
  path.resolve("secrets/contributebe.2025-11-22.private-key.pem"),
  "utf8"
);
const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

function getGitHubApp() {
  return new App({
    appId: APP_ID,
    privateKey: PRIVATE_KEY,
    oauth: {
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
    },
  });
}

export async function fetchInstallations() {
  const app = getGitHubApp();
  const res = await app.octokit.request("GET /app/installations");
  return res.data;
}

export async function createInstallationAccessToken(installationId) {
  const app = getGitHubApp();
  const token = await app.getInstallationAccessToken({ installationId });
  return token;
}

export default {
  fetchInstallations,
  createInstallationAccessToken,
};
