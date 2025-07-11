import { CreateDomainRequest, Domain, UpdateDomainRequest } from '@/types';
import { api } from './api';

export const domainService = {
  async getDomainByCharacterId(characterId: string): Promise<Domain | null> {
    try {
      const response = await api.get<Domain>(
        `/domains/character/${characterId}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  async createDomain(domainData: CreateDomainRequest): Promise<Domain> {
    const response = await api.post<Domain>('/domains', domainData);
    return response.data;
  },

  async updateDomain(
    id: string,
    domainData: UpdateDomainRequest
  ): Promise<Domain> {
    const response = await api.put<Domain>(`/domains/${id}`, domainData);
    return response.data;
  },

  async deleteDomain(id: string): Promise<void> {
    await api.delete(`/domains/${id}`);
  },

  async upsertDomain(
    characterId: string,
    domainData: Omit<CreateDomainRequest, 'characterId'>
  ): Promise<Domain> {
    const response = await api.post<Domain>(
      `/domains/upsert/${characterId}`,
      domainData
    );
    return response.data;
  },
};
