import jwt from "jsonwebtoken";
import { GITHUB_CONFIG } from "../../config/github.js";

export function generateAppJwt() {
  const now = Math.floor(Date.now() / 1000);

  const payload = {
    iat: now,
    exp: now + (10 * 60),
    iss: GITHUB_CONFIG.appId
  };

  return jwt.sign(payload, GITHUB_CONFIG.privateKey, {
    algorithm: "RS256"
  });
}
