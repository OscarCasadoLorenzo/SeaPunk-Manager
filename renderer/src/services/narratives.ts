import {
  CreateNarrativeRequest,
  Narrative,
  UpdateNarrativeRequest,
} from '@/types';
import { api } from './api';

export const narrativeService = {
  async getNarrativeByCharacterId(
    characterId: string
  ): Promise<Narrative | null> {
    try {
      const response = await api.get<Narrative>(
        `/narratives/character/${characterId}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  async createNarrative(
    narrativeData: CreateNarrativeRequest
  ): Promise<Narrative> {
    const response = await api.post<Narrative>('/narratives', narrativeData);
    return response.data;
  },

  async updateNarrative(
    id: string,
    narrativeData: UpdateNarrativeRequest
  ): Promise<Narrative> {
    const response = await api.put<Narrative>(
      `/narratives/${id}`,
      narrativeData
    );
    return response.data;
  },

  async deleteNarrative(id: string): Promise<void> {
    await api.delete(`/narratives/${id}`);
  },

  async upsertNarrative(
    characterId: string,
    narrativeData: Omit<CreateNarrativeRequest, 'characterId'>
  ): Promise<Narrative> {
    const response = await api.post<Narrative>(
      `/narratives/upsert/${characterId}`,
      narrativeData
    );
    return response.data;
  },
};
