import { App } from "@octokit/app";
import { Octokit } from "@octokit/rest";
import { config } from "../config/env.js";
import { AppError } from "../utils/errorHandler.js";
import { logger } from "../utils/logger.js";

// Helper to get private key - supports both env var (with \n) and file path
function getPrivateKey(): string {
  if (config.github.privateKey) {
    // If private key is in env var, it should have \n as literal string
    // Replace literal \n with actual newlines
    return config.github.privateKey.replace(/\\n/g, "\n");
  }
  throw new AppError(500, "GITHUB_PRIVATE_KEY not configured");
}

let appInstance: App | null = null;

function getGitHubApp(): App {
  if (!appInstance) {
    if (!config.github.appId) {
      throw new AppError(500, "GITHUB_APP_ID not configured");
    }

    try {
      const privateKey = getPrivateKey();
      appInstance = new App({
        appId: config.github.appId,
        privateKey,
        oauth: {
          clientId: config.github.clientId,
          clientSecret: config.github.clientSecret,
        },
      });
    } catch (error) {
      logger.error("Failed to initialize GitHub App", error);
      throw new AppError(500, "Failed to initialize GitHub App");
    }
  }
  return appInstance;
}

export const githubService = {
  async getInstallations() {
    try {
      const app = getGitHubApp();
      // Use app-level authentication - get a JWT-authenticated octokit
      const octokit = await app.getInstallationOctokit(0);
      const { data } = await octokit.request("GET /app/installations");
      return data;
    } catch (error) {
      logger.error("Failed to fetch installations", error);
      // Return mock data if GitHub is not configured
      if (!config.github.appId || !config.github.privateKey) {
        logger.warn("GitHub not configured, returning mock data");
        return [
          {
            id: 1,
            account: { login: "mock-org", type: "Organization" },
            app_id: 1,
            target_type: "Organization",
          },
        ];
      }
      throw new AppError(500, "Failed to fetch GitHub installations");
    }
  },

  async getInstallationRepos(installationId: number) {
    try {
      const app = getGitHubApp();
      const octokit = await app.getInstallationOctokit(installationId);
      const { data } = await octokit.request("GET /installation/repositories", {
        installation_id: installationId,
      });
      return data.repositories;
    } catch (error) {
      logger.error(`Failed to fetch repos for installation ${installationId}`, error);
      // Return mock data if GitHub is not configured
      if (!config.github.appId || !config.github.privateKey) {
        logger.warn("GitHub not configured, returning mock data");
        return [
          {
            id: 1,
            name: "mock-repo",
            full_name: "mock-org/mock-repo",
            private: false,
            html_url: "https://github.com/mock-org/mock-repo",
          },
        ];
      }
      throw new AppError(500, `Failed to fetch repos for installation ${installationId}`);
    }
  },

  async getRepoIssues(owner: string, repo: string) {
    try {
      const app = getGitHubApp();
      // For public repos, we can use app-level auth
      // For private repos, we'd need an installation token
      // For MVP, try app-level first - use installation 0 for app-level auth
      const octokit = await app.getInstallationOctokit(0);
      const { data } = await octokit.request("GET /repos/{owner}/{repo}/issues", {
        owner,
        repo,
        state: "open",
      });
      return data;
    } catch (error) {
      logger.error(`Failed to fetch issues for ${owner}/${repo}`, error);
      // Return mock data if GitHub is not configured
      if (!config.github.appId || !config.github.privateKey) {
        logger.warn("GitHub not configured, returning mock data");
        return [
          {
            id: 1,
            number: 1,
            title: "Mock Issue",
            body: "This is a mock issue",
            state: "open",
            html_url: `https://github.com/${owner}/${repo}/issues/1`,
          },
        ];
      }
      throw new AppError(500, `Failed to fetch issues for ${owner}/${repo}`);
    }
  },

  async createRepository(installationId: number, name: string, description: string, privateRepo: boolean = false) {
    try {
      const app = getGitHubApp();
      const installations = await this.getInstallations();
      const installation = installations.find((inst: any) => inst.id === installationId);
      
      if (!installation) {
        throw new AppError(404, `Installation ${installationId} not found`);
      }

      // Handle both user and organization account types
      const account = installation.account as any;
      const org = account?.login || account?.name;
      if (!org) {
        throw new AppError(400, "Installation account not found");
      }

      const octokit = await app.getInstallationOctokit(installationId);
      const { data } = await octokit.request("POST /orgs/{org}/repos", {
        org,
        name,
        description,
        private: privateRepo,
        auto_init: true, // Initialize with README
      });

      return data;
    } catch (error: any) {
      logger.error(`Failed to create repository ${name}`, error);
      if (!config.github.appId || !config.github.privateKey) {
        logger.warn("GitHub not configured, returning mock data");
        return {
          id: 1,
          name,
          full_name: `mock-org/${name}`,
          html_url: `https://github.com/mock-org/${name}`,
          clone_url: `https://github.com/mock-org/${name}.git`,
        };
      }
      throw new AppError(500, `Failed to create repository: ${error.message || "Unknown error"}`);
    }
  },

  async createIssue(installationId: number, owner: string, repo: string, title: string, body: string) {
    try {
      const app = getGitHubApp();
      const octokit = await app.getInstallationOctokit(installationId);
      const { data } = await octokit.request("POST /repos/{owner}/{repo}/issues", {
        owner,
        repo,
        title,
        body,
      });

      return data;
    } catch (error: any) {
      logger.error(`Failed to create issue in ${owner}/${repo}`, error);
      if (!config.github.appId || !config.github.privateKey) {
        logger.warn("GitHub not configured, returning mock data");
        return {
          id: 1,
          number: 1,
          title,
          body,
          state: "open",
          html_url: `https://github.com/${owner}/${repo}/issues/1`,
        };
      }
      throw new AppError(500, `Failed to create issue: ${error.message || "Unknown error"}`);
    }
  },

  async createFile(installationId: number, owner: string, repo: string, path: string, content: string, message: string, branch: string = "main") {
    try {
      const app = getGitHubApp();
      const octokit = await app.getInstallationOctokit(installationId);
      
      // Convert content to base64
      const contentBase64 = Buffer.from(content, "utf-8").toString("base64");

      const { data } = await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
        owner,
        repo,
        path,
        message,
        content: contentBase64,
        branch,
      });

      return data;
    } catch (error: any) {
      logger.error(`Failed to create file ${path} in ${owner}/${repo}`, error);
      if (!config.github.appId || !config.github.privateKey) {
        logger.warn("GitHub not configured, returning mock data");
        return {
          content: { path },
          commit: { sha: "mock-sha" },
        };
      }
      throw new AppError(500, `Failed to create file: ${error.message || "Unknown error"}`);
    }
  },
};

