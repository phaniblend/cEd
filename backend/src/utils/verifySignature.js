import crypto from "crypto";
import { GITHUB_CONFIG } from "../../config/github.js";

export function verifyWebhookSignature(payload, signature) {
  const hmac = crypto.createHmac("sha256", GITHUB_CONFIG.webhookSecret);
  const digest = `sha256=${hmac.update(payload).digest("hex")}`;

  return crypto.timingSafeEqual(
    Buffer.from(digest),
    Buffer.from(signature)
  );
}
