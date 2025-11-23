import { Octokit } from "octokit";
import { getAppClient } from "../services/githubAppService.js";

export async function getInstallations(req, res) {
  try {
    const auth = getAppClient();
    const appOctokit = new Octokit({
      authStrategy: () => auth,
    });

    const jwt = await auth({ type: "app" });

    const octo = new Octokit({ auth: jwt.token });

    const response = await octo.request("GET /app/installations");

    return res.json({ success: true, installations: response.data });

  } catch (error) {
    return res.json({
      success: false,
      error: error.message,
    });
  }
}
