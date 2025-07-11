import {
  CombatStats,
  CreateCombatStatsRequest,
  UpdateCombatStatsRequest,
} from '@/types';
import { api } from './api';

export const combatStatsService = {
  async getCombatStatsByCharacterId(
    characterId: string
  ): Promise<CombatStats | null> {
    try {
      const response = await api.get<CombatStats>(
        `/combat-stats/character/${characterId}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  async createCombatStats(
    combatStatsData: CreateCombatStatsRequest
  ): Promise<CombatStats> {
    const response = await api.post<CombatStats>(
      '/combat-stats',
      combatStatsData
    );
    return response.data;
  },

  async updateCombatStats(
    id: string,
    combatStatsData: UpdateCombatStatsRequest
  ): Promise<CombatStats> {
    const response = await api.put<CombatStats>(
      `/combat-stats/${id}`,
      combatStatsData
    );
    return response.data;
  },

  async deleteCombatStats(id: string): Promise<void> {
    await api.delete(`/combat-stats/${id}`);
  },

  async upsertCombatStats(
    characterId: string,
    combatStatsData: Omit<CreateCombatStatsRequest, 'characterId'>
  ): Promise<CombatStats> {
    const response = await api.post<CombatStats>(
      `/combat-stats/upsert/${characterId}`,
      combatStatsData
    );
    return response.data;
  },
};
