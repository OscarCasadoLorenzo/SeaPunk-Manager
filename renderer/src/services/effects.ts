import { CreateEffectRequest, Effect, UpdateEffectRequest } from '@/types';
import { api } from './api';

export const effectService = {
  async getEffectsByCharacterId(characterId: string): Promise<Effect[]> {
    const response = await api.get<Effect[]>(
      `/effects/character/${characterId}`
    );
    return response.data;
  },

  async getEffectById(id: string): Promise<Effect> {
    const response = await api.get<Effect>(`/effects/${id}`);
    return response.data;
  },

  async createEffect(effectData: CreateEffectRequest): Promise<Effect> {
    const response = await api.post<Effect>('/effects', effectData);
    return response.data;
  },

  async updateEffect(
    id: string,
    effectData: UpdateEffectRequest
  ): Promise<Effect> {
    const response = await api.put<Effect>(`/effects/${id}`, effectData);
    return response.data;
  },

  async deleteEffect(id: string): Promise<void> {
    await api.delete(`/effects/${id}`);
  },

  async getEffectsByType(characterId: string, type: string): Promise<Effect[]> {
    const response = await api.get<Effect[]>(
      `/effects/character/${characterId}/type/${type}`
    );
    return response.data;
  },

  async getActiveEffects(characterId: string): Promise<Effect[]> {
    const response = await api.get<Effect[]>(
      `/effects/character/${characterId}/active`
    );
    return response.data;
  },
};
