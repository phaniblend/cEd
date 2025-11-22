// For now, use direct service URLs. Later switch to API Gateway (8080)
const USER_SERVICE_URL = process.env.NEXT_PUBLIC_USER_SERVICE_URL || 'http://localhost:8003';
const ALM_SERVICE_URL = process.env.NEXT_PUBLIC_ALM_SERVICE_URL || 'http://localhost:8002';
const GIT_SERVICE_URL = process.env.NEXT_PUBLIC_GIT_SERVICE_URL || 'http://localhost:8001';

class ApiClient {
  private userServiceURL: string;
  private almServiceURL: string;
  private gitServiceURL: string;
  private token: string | null = null;

  constructor(userURL: string, almURL: string, gitURL: string) {
    this.userServiceURL = userURL;
    this.almServiceURL = almURL;
    this.gitServiceURL = gitURL;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  private async request<T>(
    baseURL: string,
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // Auth endpoints
  async register(data: { email: string; username: string; password: string; full_name: string }) {
    return this.request(this.userServiceURL, '/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: { email: string; password: string }) {
    const result = await this.request<{ user: any; token: string }>(this.userServiceURL, '/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (result.token) {
      this.setToken(result.token);
    }
    return result;
  }

  // Project endpoints
  async getProjects(ownerId?: number) {
    const query = ownerId ? `?owner_id=${ownerId}` : '';
    return this.request(this.almServiceURL, `/api/v1/projects${query}`);
  }

  async getProject(id: string) {
    return this.request(this.almServiceURL, `/api/v1/projects/${id}`);
  }

  async createProject(data: { name: string; description: string; private: boolean; owner_id: number }) {
    return this.request(this.almServiceURL, '/api/v1/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Issue endpoints
  async getIssues(projectId: number) {
    return this.request(this.almServiceURL, `/api/v1/issues?project_id=${projectId}`);
  }

  async getIssue(id: string) {
    return this.request(this.almServiceURL, `/api/v1/issues/${id}`);
  }

  async createIssue(data: { project_id: number; title: string; description: string; status?: string }) {
    return this.request(this.almServiceURL, '/api/v1/issues', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateIssueStatus(id: string, status: string) {
    return this.request(this.almServiceURL, `/api/v1/issues/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Pull Request endpoints
  async getPullRequests(projectId: number) {
    return this.request(this.almServiceURL, `/api/v1/pull-requests?project_id=${projectId}`);
  }

  async getPullRequest(id: string) {
    return this.request(this.almServiceURL, `/api/v1/pull-requests/${id}`);
  }

  async createPullRequest(data: {
    project_id: number;
    title: string;
    description: string;
    base_branch: string;
    head_branch: string;
  }) {
    return this.request(this.almServiceURL, '/api/v1/pull-requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Repository endpoints
  async getRepository(owner: string, name: string) {
    return this.request(this.gitServiceURL, `/api/v1/repos/${owner}/${name}`);
  }

  async createRepository(data: { name: string; owner: string; private: boolean }) {
    return this.request(this.gitServiceURL, '/api/v1/repos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getBranches(owner: string, name: string) {
    return this.request(this.gitServiceURL, `/api/v1/repos/${owner}/${name}/branches`);
  }
}

export const api = new ApiClient(USER_SERVICE_URL, ALM_SERVICE_URL, GIT_SERVICE_URL);

