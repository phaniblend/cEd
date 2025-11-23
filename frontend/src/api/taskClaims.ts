import api from './client';
import { TaskClaim } from '../types';

export interface SubmitClaimInput {
  githubPullRequestUrl: string;
}

export const taskClaimsApi = {
  claimTask: async (taskId: string): Promise<{ success: boolean; claim: TaskClaim }> => {
    const { data } = await api.post(`/task-claims/tasks/${taskId}/claim`);
    return data;
  },

  submitClaim: async (claimId: string, input: SubmitClaimInput): Promise<{ success: boolean; claim: TaskClaim }> => {
    const { data } = await api.post(`/task-claims/${claimId}/submit`, input);
    return data;
  },

  getMyClaims: async (): Promise<{ success: boolean; claims: TaskClaim[] }> => {
    const { data } = await api.get('/task-claims/my-claims');
    return data;
  },
};

