import { CreateTaskRequest, Priority, Task, UpdateTaskRequest } from '@/types';
import { api } from './api';

export const taskService = {
  async getTasks(params?: {
    userId?: string;
    completed?: boolean;
    priority?: Priority;
  }): Promise<Task[]> {
    const response = await api.get<Task[]>('/tasks', { params });
    return response.data;
  },

  async getTaskById(id: string): Promise<Task> {
    const response = await api.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  async createTask(taskData: CreateTaskRequest): Promise<Task> {
    const response = await api.post<Task>('/tasks', taskData);
    return response.data;
  },

  async updateTask(id: string, taskData: UpdateTaskRequest): Promise<Task> {
    const response = await api.put<Task>(`/tasks/${id}`, taskData);
    return response.data;
  },

  async deleteTask(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },

  async toggleTaskCompletion(id: string, completed: boolean): Promise<Task> {
    const response = await api.put<Task>(`/tasks/${id}`, { completed });
    return response.data;
  },
};

export default taskService;
