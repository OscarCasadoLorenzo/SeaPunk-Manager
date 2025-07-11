import {
  AuraGift,
  CreateAuraGiftRequest,
  UpdateAuraGiftRequest,
} from '@/types';
import { api } from './api';

export const auraGiftService = {
  async getAuraGifts(): Promise<AuraGift[]> {
    const response = await api.get<AuraGift[]>('/aura-gifts');
    return response.data;
  },

  async getAuraGiftById(id: string): Promise<AuraGift> {
    const response = await api.get<AuraGift>(`/aura-gifts/${id}`);
    return response.data;
  },

  async createAuraGift(auraGiftData: CreateAuraGiftRequest): Promise<AuraGift> {
    const response = await api.post<AuraGift>('/aura-gifts', auraGiftData);
    return response.data;
  },

  async updateAuraGift(
    id: string,
    auraGiftData: UpdateAuraGiftRequest
  ): Promise<AuraGift> {
    const response = await api.put<AuraGift>(`/aura-gifts/${id}`, auraGiftData);
    return response.data;
  },

  async deleteAuraGift(id: string): Promise<void> {
    await api.delete(`/aura-gifts/${id}`);
  },

  async getAuraGiftByName(name: string): Promise<AuraGift | null> {
    try {
      const response = await api.get<AuraGift>(`/aura-gifts/name/${name}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },
};
