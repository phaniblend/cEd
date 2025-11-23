import { verifyWebhookSignature } from "../utils/verifySignature.js";

export function githubWebhookHandler(req, res) {
  const signature = req.headers["x-hub-signature-256"];
  const body = JSON.stringify(req.body);

  if (!signature || !verifyWebhookSignature(body, signature)) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  const event = req.headers["x-github-event"];

  console.log("💬 Webhook event:", event);

  switch (event) {
    case "push":
      console.log("Push event received");
      break;

    case "pull_request":
      console.log("Pull request event");
      break;

    case "issues":
      console.log("Issue event");
      break;

    default:
      console.log("Unhandled event:", event);
  }

  return res.status(200).json({ message: "Webhook received" });
}
