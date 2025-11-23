import api from './client';

export const githubApi = {
  getInstallations: async (): Promise<{ success: boolean; installations: any[] }> => {
    const { data } = await api.get('/github/installations');
    return data;
  },

  getInstallationRepos: async (installationId: number): Promise<{ success: boolean; repos: any[] }> => {
    const { data } = await api.get(`/github/installations/${installationId}/repos`);
    return data;
  },

  getRepoIssues: async (owner: string, repo: string): Promise<{ success: boolean; issues: any[] }> => {
    const { data } = await api.get(`/github/repos/${owner}/${repo}/issues`);
    return data;
  },
};

