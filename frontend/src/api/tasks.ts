import api from './client';
import { Task } from '../types';

export const tasksApi = {
  getByProject: async (projectId: string): Promise<{ success: boolean; tasks: Task[] }> => {
    const { data } = await api.get(`/tasks/projects/${projectId}/tasks`);
    return data;
  },

  getById: async (id: string): Promise<{ success: boolean; task: Task }> => {
    const { data } = await api.get(`/tasks/${id}`);
    return data;
  },
};

