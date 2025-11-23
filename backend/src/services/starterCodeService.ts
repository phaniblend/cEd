import { exec } from "child_process";
import { promisify } from "util";
import * as fs from "fs/promises";
import * as path from "path";
import { logger } from "../utils/logger.js";

const execAsync = promisify(exec);

/**
 * Registry of official CLI commands for popular tech stacks
 * 
 * This registry maps tech stack names to their official CLI creation commands.
 * When a new tech emerges, simply add it here with the official CLI command.
 * 
 * Future enhancement: This could be moved to a database or fetched from an API
 * to allow dynamic updates without code changes.
 * 
 * To add a new tech stack:
 * 1. Find the official CLI command (usually in the tech's documentation)
 * 2. Add an entry with the command and args
 * 3. Include the docsUrl for reference
 * 
 * Example: If a new framework "SuperFramework" uses `npx create-super@latest .`
 * Add: "superframework": { command: "npx", args: ["create-super@latest", "."], docsUrl: "..." }
 */
const TECH_CLI_REGISTRY: Record<string, {
  command: string;
  args: string[];
  template?: string;
  framework?: string;
  docsUrl?: string;
}> = {
  // React + Vite
  "react-vite": {
    command: "npm",
    args: ["create", "vite@latest", ".", "--", "--template", "react-ts"],
    docsUrl: "https://vitejs.dev/guide/#scaffolding-your-first-vite-project",
  },
  "react": {
    command: "npm",
    args: ["create", "vite@latest", ".", "--", "--template", "react-ts"],
    docsUrl: "https://vitejs.dev/guide/#scaffolding-your-first-vite-project",
  },
  // Next.js
  "nextjs": {
    command: "npx",
    args: ["create-next-app@latest", ".", "--typescript", "--tailwind", "--app", "--no-src-dir", "--import-alias", "@/*", "--yes"],
    docsUrl: "https://nextjs.org/docs/getting-started/installation",
  },
  "next": {
    command: "npx",
    args: ["create-next-app@latest", ".", "--typescript", "--tailwind", "--app", "--no-src-dir", "--import-alias", "@/*", "--yes"],
    docsUrl: "https://nextjs.org/docs/getting-started/installation",
  },
  // Vue + Vite
  "vue-vite": {
    command: "npm",
    args: ["create", "vite@latest", ".", "--", "--template", "vue-ts"],
    docsUrl: "https://vuejs.org/guide/quick-start.html#creating-a-vue-application",
  },
  "vue": {
    command: "npm",
    args: ["create", "vite@latest", ".", "--", "--template", "vue-ts"],
    docsUrl: "https://vuejs.org/guide/quick-start.html#creating-a-vue-application",
  },
  // Nuxt
  "nuxt": {
    command: "npx",
    args: ["nuxi@latest", "init", ".", "--packageManager", "npm"],
    docsUrl: "https://nuxt.com/docs/getting-started/installation",
  },
  "vue-nuxt": {
    command: "npx",
    args: ["nuxi@latest", "init", ".", "--packageManager", "npm"],
    docsUrl: "https://nuxt.com/docs/getting-started/installation",
  },
  // Angular
  "angular": {
    command: "npx",
    args: ["@angular/cli@latest", "new", ".", "--routing", "--style", "css", "--skip-git", "--package-manager", "npm"],
    docsUrl: "https://angular.io/guide/setup-local",
  },
  // Svelte
  "svelte": {
    command: "npm",
    args: ["create", "vite@latest", ".", "--", "--template", "svelte-ts"],
    docsUrl: "https://svelte.dev/docs/getting-started",
  },
  "sveltekit": {
    command: "npm",
    args: ["create", "svelte@latest", ".", "--template", "skeleton", "--types", "typescript"],
    docsUrl: "https://kit.svelte.dev/docs/creating-a-project",
  },
  // Remix
  "remix": {
    command: "npx",
    args: ["create-remix@latest", ".", "--template", "remix-run/remix/templates/remix", "--no-install"],
    docsUrl: "https://remix.run/docs/en/main/start/quickstart",
  },
  // SolidJS
  "solid": {
    command: "npm",
    args: ["create", "solid@latest", ".", "--template", "ts"],
    docsUrl: "https://www.solidjs.com/guides/getting-started",
  },
  // Qwik
  "qwik": {
    command: "npm",
    args: ["create", "qwik@latest", ".", "--yes"],
    docsUrl: "https://qwik.builder.io/docs/getting-started/",
  },
};

/**
 * Normalizes tech stack name to match registry keys
 */
function normalizeTechStack(techStack: string): string {
  return techStack
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/**
 * Finds the best matching CLI command for a tech stack
 */
function findTechCommand(techStack: string): { command: string; args: string[]; docsUrl?: string } | null {
  const normalized = normalizeTechStack(techStack);
  
  // Direct match
  if (TECH_CLI_REGISTRY[normalized]) {
    return TECH_CLI_REGISTRY[normalized];
  }
  
  // Partial match (e.g., "react with vite" matches "react-vite")
  for (const [key, value] of Object.entries(TECH_CLI_REGISTRY)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }
  
  // Try to match individual words
  const words = normalized.split("-");
  for (const word of words) {
    if (TECH_CLI_REGISTRY[word]) {
      return TECH_CLI_REGISTRY[word];
    }
  }
  
  return null;
}

/**
 * Generates starter code using official CLI tools
 * Creates a temporary directory, runs the CLI command, reads all files, then cleans up
 */
export async function generateStarterCode(
  techStack: string,
  projectName: string
): Promise<Record<string, string> | null> {
  const techCommand = findTechCommand(techStack);
  
  if (!techCommand) {
    logger.warn(`No CLI command found for tech stack: ${techStack}`);
    logger.info(`Available tech stacks: ${Object.keys(TECH_CLI_REGISTRY).join(", ")}`);
    return null;
  }

  // Create temporary directory
  const tempDir = path.join(process.cwd(), "temp", `starter-${Date.now()}-${Math.random().toString(36).substring(7)}`);
  
  try {
    await fs.mkdir(tempDir, { recursive: true });
    logger.info(`Created temp directory: ${tempDir}`);

    // Change to temp directory and run CLI command
    const command = `${techCommand.command} ${techCommand.args.join(" ")}`;
    logger.info(`Running command: ${command} in ${tempDir}`);

    // Run the command with auto-yes flags where possible
    const { stdout, stderr } = await execAsync(command, {
      cwd: tempDir,
      env: {
        ...process.env,
        // Auto-accept prompts
        CI: "true",
      },
      timeout: 120000, // 2 minute timeout
    });

    logger.info(`Command output: ${stdout}`);
    if (stderr) {
      logger.warn(`Command stderr: ${stderr}`);
    }

    // Read all files from the generated directory
    const files: Record<string, string> = {};
    await readDirectoryRecursive(tempDir, tempDir, files);

    // Remove node_modules and other build artifacts
    const filteredFiles: Record<string, string> = {};
    for (const [filePath, content] of Object.entries(files)) {
      // Skip node_modules, .git, dist, build, .next, etc.
      if (
        filePath.includes("node_modules") ||
        filePath.includes(".git") ||
        filePath.includes("dist") ||
        filePath.includes("build") ||
        filePath.includes(".next") ||
        filePath.includes(".nuxt") ||
        filePath.includes(".angular") ||
        filePath.includes("coverage") ||
        filePath.includes(".cache")
      ) {
        continue;
      }
      filteredFiles[filePath] = content;
    }

    logger.info(`Generated ${Object.keys(filteredFiles).length} files for tech stack: ${techStack}`);
    return { files: filteredFiles };

  } catch (error: any) {
    logger.error(`Failed to generate starter code for ${techStack}`, error);
    throw new Error(`Failed to generate starter code: ${error.message}`);
  } finally {
    // Clean up temporary directory
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
      logger.info(`Cleaned up temp directory: ${tempDir}`);
    } catch (cleanupError) {
      logger.error(`Failed to clean up temp directory: ${tempDir}`, cleanupError);
    }
  }
}

/**
 * Recursively reads all files from a directory
 */
async function readDirectoryRecursive(
  baseDir: string,
  currentDir: string,
  files: Record<string, string>
): Promise<void> {
  const entries = await fs.readdir(currentDir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(currentDir, entry.name);
    const relativePath = path.relative(baseDir, fullPath);

    if (entry.isDirectory()) {
      await readDirectoryRecursive(baseDir, fullPath, files);
    } else if (entry.isFile()) {
      try {
        const content = await fs.readFile(fullPath, "utf-8");
        files[relativePath] = content;
      } catch (error) {
        // Skip binary files or files that can't be read as text
        logger.warn(`Skipping file ${relativePath}: ${error}`);
      }
    }
  }
}

/**
 * Gets available tech stacks from the registry
 */
export function getAvailableTechStacks(): Array<{ key: string; docsUrl?: string }> {
  return Object.entries(TECH_CLI_REGISTRY).map(([key, value]) => ({
    key,
    docsUrl: value.docsUrl,
  }));
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use generateStarterCode instead
 */
export function getStarterCode(template: string): Record<string, string> | null {
  // This is now deprecated - we use generateStarterCode instead
  return null;
}
