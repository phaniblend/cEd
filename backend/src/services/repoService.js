import { request } from "@octokit/request";
import { GITHUB_CONFIG } from "../../config/github.js";
import { getInstallationToken } from "./githubAppService.js";

export async function createRepo(installationId, repoName) {
  const token = await getInstallationToken(installationId);

  const res = await request("POST /orgs/{org}/repos", {
    org: GITHUB_CONFIG.org,
    name: repoName,
    private: true,
    headers: {
      authorization: `token ${token}`,
      accept: "application/vnd.github+json"
    }
  });

  return res.data;
}

export async function createBranch(installationId, repo, newBranch) {
  const token = await getInstallationToken(installationId);

  const { data: defaultBranch } = await request(
    "GET /repos/{owner}/{repo}/branches/{branch}",
    {
      owner: GITHUB_CONFIG.org,
      repo,
      branch: "main",
      headers: {
        authorization: `token ${token}`,
        accept: "application/vnd.github+json"
      }
    }
  );

  const sha = defaultBranch.commit.sha;

  const res = await request("POST /repos/{owner}/{repo}/git/refs", {
    owner: GITHUB_CONFIG.org,
    repo,
    ref: `refs/heads/${newBranch}`,
    sha,
    headers: {
      authorization: `token ${token}`,
      accept: "application/vnd.github+json"
    }
  });

  return res.data;
}

export async function commitFile(
  installationId,
  repo,
  filePath,
  content,
  branch
) {
  const token = await getInstallationToken(installationId);

  const buff = Buffer.from(content, "utf8").toString("base64");

  const res = await request("PUT /repos/{owner}/{repo}/contents/{path}", {
    owner: GITHUB_CONFIG.org,
    repo,
    path: filePath,
    message: `cEd commit: updating ${filePath}`,
    content: buff,
    branch,
    headers: {
      authorization: `token ${token}`,
      accept: "application/vnd.github+json"
    }
  });

  return res.data;
}

export async function createPullRequest(
  installationId,
  repo,
  title,
  body,
  base = "main",
  head = "task-branch"
) {
  const token = await getInstallationToken(installationId);

  const res = await request("POST /repos/{owner}/{repo}/pulls", {
    owner: GITHUB_CONFIG.org,
    repo,
    title,
    body,
    head,
    base,
    headers: {
      authorization: `token ${token}`,
      accept: "application/vnd.github+json"
    }
  });

  return res.data;
}
