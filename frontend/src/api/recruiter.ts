import api from './client';

export interface RecruiterFilters {
  skills?: string[];
  minAccepted?: number;
}

export interface Learner {
  id: string;
  name: string;
  email: string;
  headline?: string;
  skills: string[];
  createdAt: string;
  totalTasksClaimed: number;
  totalTasksSubmitted: number;
  totalTasksAccepted: number;
}

export const recruiterApi = {
  getLearners: async (filters?: RecruiterFilters): Promise<{ success: boolean; learners: Learner[] }> => {
    const params = new URLSearchParams();
    if (filters?.skills) params.append('skills', filters.skills.join(','));
    if (filters?.minAccepted !== undefined) params.append('minAccepted', String(filters.minAccepted));

    const { data } = await api.get(`/recruiter/learners?${params.toString()}`);
    return data;
  },

  getLearnerDetails: async (learnerId: string): Promise<{ success: boolean; learner: any }> => {
    const { data } = await api.get(`/recruiter/learners/${learnerId}`);
    return data;
  },
};

