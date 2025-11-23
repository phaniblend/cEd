import jwt from "jsonwebtoken";
import fs from "fs";

export function generateAppJwt() {
  const privateKey = fs.readFileSync(
    "E:/cEd-GH/backend/secrets/contributebe.2025-11-22.private-key.pem",
    "utf8"
  );

  const now = Math.floor(Date.now() / 1000);

  const payload = {
    iat: now,
    exp: now + 600,
    iss: process.env.GH_APP_ID
  };

  return jwt.sign(payload, privateKey, { algorithm: "RS256" });
}
