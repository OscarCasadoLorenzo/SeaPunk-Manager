import {
  Attribute,
  CreateAttributeRequest,
  UpdateAttributeRequest,
} from '@/types';
import { api } from './api';

export const attributeService = {
  async getAttributeByCharacterId(
    characterId: string
  ): Promise<Attribute | null> {
    try {
      const response = await api.get<Attribute>(
        `/attributes/character/${characterId}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  async createAttribute(
    attributeData: CreateAttributeRequest
  ): Promise<Attribute> {
    const response = await api.post<Attribute>('/attributes', attributeData);
    return response.data;
  },

  async updateAttribute(
    id: string,
    attributeData: UpdateAttributeRequest
  ): Promise<Attribute> {
    const response = await api.put<Attribute>(
      `/attributes/${id}`,
      attributeData
    );
    return response.data;
  },

  async deleteAttribute(id: string): Promise<void> {
    await api.delete(`/attributes/${id}`);
  },

  async upsertAttribute(
    characterId: string,
    attributeData: Omit<CreateAttributeRequest, 'characterId'>
  ): Promise<Attribute> {
    const response = await api.post<Attribute>(
      `/attributes/upsert/${characterId}`,
      attributeData
    );
    return response.data;
  },
};
