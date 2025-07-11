import { CreateEssenceRequest, Essence, UpdateEssenceRequest } from '@/types';
import { api } from './api';

export const essenceService = {
  async getEssences(): Promise<Essence[]> {
    const response = await api.get<Essence[]>('/essences');
    return response.data;
  },

  async getEssenceById(id: string): Promise<Essence> {
    const response = await api.get<Essence>(`/essences/${id}`);
    return response.data;
  },

  async createEssence(essenceData: CreateEssenceRequest): Promise<Essence> {
    const response = await api.post<Essence>('/essences', essenceData);
    return response.data;
  },

  async updateEssence(
    id: string,
    essenceData: UpdateEssenceRequest
  ): Promise<Essence> {
    const response = await api.put<Essence>(`/essences/${id}`, essenceData);
    return response.data;
  },

  async deleteEssence(id: string): Promise<void> {
    await api.delete(`/essences/${id}`);
  },

  async getEssenceByName(name: string): Promise<Essence | null> {
    try {
      const response = await api.get<Essence>(`/essences/name/${name}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },
};
