import api from './client';
import { Project } from '../types';

export interface ProjectFilters {
  skills?: string[];
  tag?: string;
  status?: string;
  featured?: boolean;
}

export const projectsApi = {
  getAll: async (filters?: ProjectFilters): Promise<{ success: boolean; projects: Project[] }> => {
    const params = new URLSearchParams();
    if (filters?.skills) params.append('skills', filters.skills.join(','));
    if (filters?.tag) params.append('tag', filters.tag);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.featured !== undefined) params.append('featured', String(filters.featured));

    const { data } = await api.get(`/projects?${params.toString()}`);
    return data;
  },

  getById: async (id: string): Promise<{ success: boolean; project: Project }> => {
    const { data } = await api.get(`/projects/${id}`);
    return data;
  },

  getBySlug: async (slug: string): Promise<{ success: boolean; project: Project }> => {
    const { data } = await api.get(`/projects/slug/${slug}`);
    return data;
  },
};

