import {
  createRepo,
  createBranch,
  commitFile,
  createPullRequest
} from "../services/repoService.js";

export async function createRepository(req, res) {
  try {
    const { installationId, repoName } = req.body;

    const repo = await createRepo(installationId, repoName);

    return res.json({ success: true, repo });
  } catch (err) {
    console.error("Repo creation error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}

export async function createTaskBranch(req, res) {
  try {
    const { installationId, repo, branchName } = req.body;

    const branch = await createBranch(installationId, repo, branchName);

    return res.json({ success: true, branch });
  } catch (err) {
    console.error("Branch creation error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}

export async function commitToRepo(req, res) {
  try {
    const { installationId, repo, path, content, branch } = req.body;

    const result = await commitFile(installationId, repo, path, content, branch);

    return res.json({ success: true, result });
  } catch (err) {
    console.error("Commit error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}

export async function openPullRequest(req, res) {
  try {
    const { installationId, repo, title, body, base, head } = req.body;

    const pr = await createPullRequest(
      installationId,
      repo,
      title,
      body,
      base,
      head
    );

    return res.json({ success: true, pr });
  } catch (err) {
    console.error("PR error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
